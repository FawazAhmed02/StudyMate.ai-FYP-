import pytesseract
from pdf2image import convert_from_path
from PyPDF2 import PdfReader
import os
import json
import hashlib
import chromadb
import google.generativeai as genai
from chromadb.utils.embedding_functions import EmbeddingFunction
from google.api_core import retry

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
def get_note_prompt(passage, topic, detail_level):
    passage = passage.replace("\n", " ")

    level_descriptions = {
        "very detailed": "Write highly detailed, well-explained notes covering all important concepts, examples, and definitions.",
        "slightly detailed": "Write moderately detailed notes that cover all key ideas but keep explanations concise.",
        "small overview": "Write a brief summary highlighting only the main points and essential facts."
    }

    if detail_level not in level_descriptions:
        raise ValueError("Detail level must be one of: 'very detailed', 'slightly detailed', or 'small overview'")

    return f"""You are a helpful AI tutor.

PASSAGE: {passage}

TASK: Generate {detail_level} notes on the topic "{topic}".
{level_descriptions[detail_level]}
"""

# ---------------------- NOTE HISTORY CHECK ----------------------
def get_note_id(topic, detail_level, user_id):
    return hashlib.md5(f"{user_id}_{topic}_{detail_level}".encode()).hexdigest()

def is_note_duplicate(note_id, history_file="note_history.json"):
    if os.path.exists(history_file):
        with open(history_file, 'r') as f:
            history = json.load(f)
        return note_id in history
    return False

def save_note_to_history(note_id, topic, detail_level, user_id, notes, history_file="note_history.json"):
    if os.path.exists(history_file):
        with open(history_file, 'r') as f:
            history = json.load(f)
    else:
        history = {}

    history[note_id] = {
        "topic": topic,
        "detail_level": detail_level,
        "user_id": user_id,
        "notes": notes
    }

    with open(history_file, 'w') as f:
        json.dump(history, f, indent=2)

# ---------------------- MAIN FUNCTION ----------------------
def generate_notes(book_path, topic, detail_level="slightly detailed", user_id="guest", regenerate=False):
    GOOGLE_API_KEY = "AIzaSyCpADQEXcKLtBywvs-T1Ftc4in_qHsfHZU"
    genai.configure(api_key=GOOGLE_API_KEY)

    note_id = get_note_id(topic, detail_level, user_id)
    if is_note_duplicate(note_id) and not regenerate:
        print("Notes already exist. Use regenerate=True to force regeneration.")
        return

    # Setup
    embed_fn = GeminiEmbeddingFunction()
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    db = chroma_client.get_or_create_collection(name="googlecard", embedding_function=embed_fn)

    pdf_hash = hashlib.md5(open(book_path, 'rb').read()).hexdigest()

    # If PDF not in DB, embed it
    all_ids = db.get().get("ids", [])
    if pdf_hash not in all_ids:
        print("Extracting and indexing document...")
        document_text = extract_text_from_pdf(book_path)
        embed_fn.document_mode = True
        db.add(
            documents=[document_text],
            ids=[pdf_hash],
            metadatas=[{"source": book_path, "user_id": user_id}]
        )
    else:
        print("PDF already indexed.")

    # Query
    embed_fn.document_mode = False
    print(f"Searching for topic '{topic}'...")
    result = db.query(query_texts=[topic], n_results=3, where={"source": book_path})

    if not result.get("documents") or not result["documents"][0]:
        print("No relevant content found in PDF.")
        return

    passage = result["documents"][0][0]
    prompt = get_note_prompt(passage, topic, detail_level)

    print("Generating notes with Gemini...")
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)

    print("\nGenerated Notes:\n")
    print(response.text)

    save_note_to_history(note_id, topic, detail_level, user_id, response.text)

# ---------------------- ENTRY POINT ----------------------
if __name__ == "__main__":
    import sys
    pdf_path = sys.argv[1]  # Get the actual PDF path from command line
    topic = sys.argv[2]
    detail_level = sys.argv[3]
    user_id = sys.argv[4]
    regenerate = True  # Always regenerate for API calls

    generate_notes(pdf_path, topic, detail_level, user_id, regenerate)
