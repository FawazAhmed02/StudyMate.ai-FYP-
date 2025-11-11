import google.generativeai as genai
import re
import sys
import os

def generate_concept_notes(api_key, topic, max_words=500):
    """Generates concept notes using the Gemini API, ensuring plain text output."""
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""Explain the following topic in a clear and concise way, suitable for understanding the core concepts. Keep the explanation under {max_words} words. Provide the answer as plain text, without any markdown formatting or extra symbols: {topic}"""

        response = model.generate_content(prompt)
        text = response.text.strip()
        cleaned_text = re.sub(r"[*~`]", "", text)  # Remove markdown
        return cleaned_text

    except Exception as e:
        return f"An error occurred: {e}"

if __name__ == "__main__":
    # Secure API Key using environment variable
    api_key = "AIzaSyCQUNdMVOCMarzzqXr2CDr0cBbJbECTO1o"
    if not api_key:
        print("Error: API key not found. Set the GEMINI_API_KEY environment variable.")
        sys.exit(1)

    # Get topic from command-line argument
    if len(sys.argv) > 1:
        topic = " ".join(sys.argv[1:])  # Support multi-word topics
    else:
        print("Error: No topic provided.")
        sys.exit(1)

    # Generate notes
    notes = generate_concept_notes(api_key, topic)

    # Print output for Flask to capture
    print(notes)
