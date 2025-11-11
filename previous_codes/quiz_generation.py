import pytesseract
from pdf2image import convert_from_path
from PyPDF2 import PdfReader
import os
import google.generativeai as genai
from google.api_core import retry
import chromadb
from chromadb.utils.embedding_functions import EmbeddingFunction
import sys

def extract_text_from_pdf(pdf_path):
    try:
        # Extract text using PyPDF2 (if text layer exists)
        reader = PdfReader(pdf_path)
        text = ''
        for page in reader.pages:
            text += page.extract_text() or ''
        
        if text.strip():
            print("Extracted text using PyPDF2.")
            return text
    except Exception as e:
        print(f"PyPDF2 failed: {e}")
    
    # Fallback to OCR if PyPDF2 fails
    print("Fallback to OCR...")
    images = convert_from_path(pdf_path)  # Convert PDF pages to images
    ocr_text = ''
    
    for image in images:
        ocr_text += pytesseract.image_to_string(image)
    
    return ocr_text

class GeminiEmbeddingFunction(EmbeddingFunction):
    def __init__(self):
        self.document_mode = True  # Flag to determine if embedding is for documents or queries

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

def function(book1_path, Query):
    GOOGLE_API_KEY = 'AIzaSyCpADQEXcKLtBywvs-T1Ftc4in_qHsfHZU'  # Daniyal's Key
    genai.configure(api_key=GOOGLE_API_KEY)

    print("Extracting text from PDF...")
    document_text = extract_text_from_pdf(book1_path)
    documents = [document_text]

    # Initialize ChromaDB
    DB_NAME = "googlecard"
    print("Initializing ChromaDB...")

    embed_fn = GeminiEmbeddingFunction()
    embed_fn.document_mode = True  # Set to document embedding mode

    chroma_client = chromadb.PersistentClient(path="./chroma_db")  # Use persistent storage
    db = chroma_client.get_or_create_collection(name=DB_NAME, embedding_function=embed_fn)

    # Deleting documents from ChromaDB
    print("Deleting previous documents from ChromaDB...")
    data = db.get()  
    if data and "ids" in data and data["ids"]:  # Ensure "ids" exist and are not empty
        db.delete(ids=data["ids"])

    print("Previous documents deleted successfully.")

    # Add documents to ChromaDB
    print("Adding documents to ChromaDB...")
    db.add(documents=documents, ids=[str(i) for i in range(len(documents))])
    print("Documents added successfully.")

    # Switch to query mode for embeddings
    embed_fn.document_mode = False

    print("Searching the ChromaDB...")
    result = db.query(query_texts=[Query], n_results=1)

    # Ensure result contains relevant documents
    if result and result.get("documents"):
        passage = result["documents"][0][0]  # Extract top result
    else:
        print("No relevant passages found.")
        return

    print("Generating quiz prompt...")

    passage_oneline = passage.replace("\n", " ")
    query_oneline = Query.replace("\n", " ")

    prompt = f"""
    You are a helpful and knowledgeable bot that creates quizzes based on the provided reference passage. Your task is to generate 20 multiple-choice questions (MCQs) related to the topic mentioned in the query. 

    **Output Format:**  
    Each question should follow this format:  
    Q1. [Question]  
    A) [Option 1]  
    B) [Option 2]  
    C) [Option 3]  
    D) [Option 4]  
    **Answer:** [Correct Option Letter]  

    **Example Output:**  
    Q1. What is the capital of France?  
    A) Berlin  
    B) Madrid  
    C) Paris  
    D) Rome  
    **Answer:** C  

    **Instructions:**  
    1. Generate exactly **10 multiple-choice questions** based on the topic and passage.  
    2. Each question must have **four options (A, B, C, D)**.  
    3. The correct answer must be provided **immediately below each question** in the format shown.  

    **Topic:** {query_oneline}  
    **PASSAGE:** {passage_oneline}  
    """

    print("Generating quiz using Gemini AI...")
    
    model = genai.GenerativeModel("gemini-1.5-flash-latest")
    response = model.generate_content(prompt)

    print("\nGenerated Quiz:")
    print(response.text)  # Output generated quiz

# Handling command-line arguments
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python quiz_generation.py <book_path> <query>")
        sys.exit(1)

    book_path = sys.argv[1]
    query = sys.argv[2]

    function(book_path, query)
