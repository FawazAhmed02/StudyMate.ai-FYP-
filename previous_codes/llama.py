from langchain_ollama.llms import OllamaLLM
# from langchain.chains import QuestionAnswering
from langchain_core.prompts import ChatPromptTemplate

import pytesseract
from pdf2image import convert_from_path
from PyPDF2 import PdfReader
import os
# from langchain.document_transformers from django.utils.translation import ugettext_lazy as _

template ="""
Answer the question below.

Here is the restricted context: {context_pdf}

question: {question} 
answer:
"""

model =OllamaLLM(model="llama3.1")
prompt =ChatPromptTemplate.from_template(template)
chain = prompt | model

def trial(context):
    print("welcome")
    while True:
        user_inp =input("ask the model : ")
        if user_inp.lower()=='exit':
            break
        result =chain.invoke({"context_pdf":context,"question":user_inp})
        print("the bot said : \n",result)   

def extract_text_from_pdf(pdf_path):
    try:
        # First, try extracting text using PyPDF2 (if text layer exists)
        reader = PdfReader(pdf_path)
        text = ''
        for page in reader.pages:
            text += page.extract_text() or ''
        
        if text.strip():
            print("Extracted text using PyPDF2.")
            return text
    except Exception as e:
        print(f"PyPDF2 failed: {e}")
    
    # If PyPDF2 fails or no text found, fallback to OCR
    print("Fallback to OCR...")
    images = convert_from_path(pdf_path)  # Convert PDF pages to images
    ocr_text = ''
    
    for image in images:
        ocr_text += pytesseract.image_to_string(image)
    
    return ocr_text


# Example usage
pdf_file = "3. Hallucingens.pdf"  # Path to your PDF file
if os.path.exists(pdf_file):
    text = extract_text_from_pdf(pdf_file)
    # print(text)
else:
    print("File not found.")

trial(text)