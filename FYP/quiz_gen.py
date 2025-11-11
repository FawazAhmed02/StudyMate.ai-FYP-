import pytesseract
from pdf2image import convert_from_path
from PyPDF2 import PdfReader
import os
import json
import google.generativeai as genai
from google.api_core import retry
import chromadb
from chromadb.utils.embedding_functions import EmbeddingFunction
import hashlib

# ---------------------- TEXT EXTRACTION ----------------------
def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = ''.join(page.extract_text() or '' for page in reader.pages)
        if text.strip():
            print("Extracted text using PyPDF2.")
            return text
    except Exception as e:
        print(f"PyPDF2 failed: {e}")

    print("Fallback to OCR...")
    images = convert_from_path(pdf_path)
    return ''.join(pytesseract.image_to_string(image) for image in images)

# ---------------------- EMBEDDING FUNCTION ----------------------
class GeminiEmbeddingFunction(EmbeddingFunction):
    def __init__(self):
        self.document_mode = True

    def __call__(self, input):
        embedding_task = "retrieval_document" if self.document_mode else "retrieval_query"
        retry_policy = {"retry": retry.Retry(predicate=retry.if_transient_error)}
        response = genai.embed_content(
            model="models/text-embedding-004",
            content=input,
            task_type=embedding_task,
            request_options=retry_policy,
        )
        return response["embedding"]

# ---------------------- PROMPT TEMPLATES ----------------------
def get_prompt(passage, topic, quiz_type, difficulty):
    topic = topic.replace("\n", " ")
    passage = passage.replace("\n", " ")

    templates = {
        "mcq": f"""Generate 5 {difficulty.lower()} level multiple-choice questions on "{topic}" from the given passage.

Format:
Q1. Question?
A) Option1
B) Option2
C) Option3
D) Option4
Answer: B
""",
        "fill_in_the_blanks": f"""Generate 5 {difficulty.lower()} level fill-in-the-blank questions on "{topic}" from the passage.

Format:
Q1. The ____ is the powerhouse of the cell.
Answer: mitochondria
""",
        "true_false": f"""Generate 5 {difficulty.lower()} level true or false questions on "{topic}" using the passage.

Format:
Q1. The sun is a planet.
Answer: False
(Do not provide explanations or justifications for the answers.)
""",
        "qa": f"""Generate 5 {difficulty.lower()} level short answer questions on "{topic}" from the passage.

Format:
Q1. What is the function of mitochondria?
Answer: They produce energy.
"""
    }

    if quiz_type not in templates:
        raise ValueError(f"Unsupported quiz type: {quiz_type}")

    return f"PASSAGE: {passage}\n{templates[quiz_type]}"

# ---------------------- HASHING & REGISTRY ----------------------
def get_pdf_hash(pdf_path):
    """Generate a hash for the PDF to track if it's already indexed."""
    with open(pdf_path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def is_pdf_already_indexed(pdf_hash, registry_file="db_registry.json"):
    """Check if the PDF has been indexed already."""
    if os.path.exists(registry_file):
        with open(registry_file, 'r') as f:
            registry = json.load(f)
        return pdf_hash in registry
    return False

def mark_pdf_as_indexed(pdf_hash, registry_file="db_registry.json"):
    """Mark a PDF as indexed by storing its hash in the registry."""
    if os.path.exists(registry_file):
        with open(registry_file, 'r') as f:
            registry = json.load(f)
    else:
        registry = {}

    registry[pdf_hash] = True
    with open(registry_file, 'w') as f:
        json.dump(registry, f, indent=2)

# ---------------------- DUPLICATE CHECK ----------------------
def generate_quiz_id(topic, quiz_type, difficulty, user_id):
    """Generate a unique quiz ID based on user, topic, quiz type, and difficulty."""
    return hashlib.md5(f"{user_id}_{topic}_{quiz_type}_{difficulty}".encode()).hexdigest()

def is_duplicate_quiz(quiz_id, history_file="quiz_history.json"):
    """Check if a quiz for the same topic, type, and difficulty already exists."""
    if os.path.exists(history_file):
        with open(history_file, 'r') as f:
            history = json.load(f)
        return quiz_id in history
    return False

def save_quiz_to_history(quiz_id, topic, quiz_type, difficulty, user_id, quiz_content, history_file="quiz_history.json"):
    """Save the generated quiz to the history."""
    if os.path.exists(history_file):
        with open(history_file, 'r') as f:
            history = json.load(f)
    else:
        history = {}

    history[quiz_id] = {
        "topic": topic,
        "type": quiz_type,
        "difficulty": difficulty,
        "user_id": user_id,
        "quiz": quiz_content
    }

    with open(history_file, 'w') as f:
        json.dump(history, f, indent=2)

# ---------------------- MAIN FUNCTION ----------------------
def generate_quiz(book_path, topic, quiz_type="true_false", difficulty="hard", user_id="guest", regenerate=False):
    GOOGLE_API_KEY = "AIzaSyCpADQEXcKLtBywvs-T1Ftc4in_qHsfHZU"
    genai.configure(api_key=GOOGLE_API_KEY)

    quiz_id = generate_quiz_id(topic, quiz_type, difficulty, user_id)
    if is_duplicate_quiz(quiz_id) and not regenerate:
        print("Quiz already exists. Use regenerate=True to generate a new one.")
        return

    pdf_hash = get_pdf_hash(book_path)

    # Set up embedding function and DB
    embed_fn = GeminiEmbeddingFunction()
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    db = chroma_client.get_or_create_collection(name="googlecard", embedding_function=embed_fn)

    # Check if this PDF is already embedded
    all_ids = db.get().get("ids", [])
    if pdf_hash not in all_ids:
        print("Extracting text from PDF (not yet embedded)...")
        document_text = extract_text_from_pdf(book_path)
        print("Indexing document in ChromaDB...")
        embed_fn.document_mode = True
        db.add(
            documents=[document_text],
            ids=[pdf_hash],
            metadatas=[{"source": book_path, "user_id": user_id}]
        )
        mark_pdf_as_indexed(pdf_hash)
    else:
        print("PDF already embedded. Skipping text extraction and indexing.")

    # Query only within this book
    embed_fn.document_mode = False
    print(f"Searching for topic '{topic}' within this specific PDF...")
    result = db.query(query_texts=[topic], n_results=3, where={"source": book_path})

    if not result.get("documents") or not result["documents"][0]:
        print("No relevant passage found in this book.")
        return

    passage = result["documents"][0][0]
    prompt = get_prompt(passage, topic, quiz_type, difficulty)

    print("Generating quiz with Gemini...")
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)

    print("\nGenerated Quiz:\n")
    print(response.text)

    save_quiz_to_history(quiz_id, topic, quiz_type, difficulty, user_id, response.text)



# ---------------------- ENTRY POINT ----------------------
if __name__ == "__main__":
    import sys
    pdf_path = sys.argv[1]  # Get the actual PDF path from command line
    topic = sys.argv[2]
    quiz_type = sys.argv[3]
    difficulty = sys.argv[4]
    user_id = sys.argv[5]
    regenerate = True  # Always regenerate for API calls

    generate_quiz(pdf_path, topic, quiz_type, difficulty, user_id, regenerate)
