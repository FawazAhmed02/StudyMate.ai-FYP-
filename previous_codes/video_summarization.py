import time
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
import sys

# ✅ Configure Gemini API Key
GEMINI_API_KEY = "AIzaSyCQUNdMVOCMarzzqXr2CDr0cBbJbECTO1o"  # 🔹 Replace with your actual Gemini API Key
genai.configure(api_key=GEMINI_API_KEY)

# ✅ Function to extract YouTube transcript
def get_transcript(video_url, language="en"):
    start_time = time.time()  # Start timing
    video_id = video_url.split("v=")[-1].split("&")[0]  # Extract video ID
    
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
        text = " ".join([entry["text"] for entry in transcript])
        
        execution_time = time.time() - start_time  # Calculate time taken
        return text, execution_time
    except Exception as e:
        return f"Error: {str(e)}", None

# ✅ Function to dynamically summarize transcript based on word count
def summarize_text(text):
    word_count = len(text.split())  # Count words in transcript

    # 🔹 Set summary length dynamically
    if word_count < 5000:
        summary_length = "short (concise summary under 1000 words)"
    elif 5000 <= word_count <= 10000:
        summary_length = "medium-length (1500-2000 words)"
    else:
        summary_length = "detailed (3500-6000 words)"

    # 🔹 Generate prompt with dynamic length constraint
    prompt = f"""
    Summarize the main topic of the following text with a {summary_length}.
    
    Text: {text}
    """

    try:
        model = genai.GenerativeModel("gemini-pro")  # Gemini Pro Model
        response = model.generate_content(prompt)
        return response.text.strip() if response.text else "Error: No summary generated."
    except Exception as e:
        return f"Error: {str(e)}"

# ✅ Main Execution Fix (Handles Command-Line Inputs)
if __name__ == "__main__":
    if len(sys.argv) > 1:
        youtube_url = sys.argv[1]  # ✅ Get URL from command-line argument
    else:
        youtube_url = input("Enter YouTube URL: ")  # ✅ Prompt for input if not provided

    # Step 1: Get Transcript
    transcript, exec_time = get_transcript(youtube_url)

    if "Error" in transcript:
        print(transcript)
    else:
        print("Transcript Extracted Successfully!")
        print(f"Execution Time: {exec_time:.2f} seconds\n")

        # Step 2: Summarize the transcript
        summary = summarize_text(transcript)
        print("\n *Summary of Main Topic:*")
        print(summary)
