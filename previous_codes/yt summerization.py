import time
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
import sys

# ✅ Configure Gemini API Key
GEMINI_API_KEY = "AIzaSyCpADQEXcKLtBywvs-T1Ftc4in_qHsfHZU"  # 🔹 Replace with your Gemini API Key
genai.configure(api_key=GEMINI_API_KEY)

# ✅ Step 1: Get transcript
def get_transcript(video_url, language="en"):
    start_time = time.time()
    video_id = video_url.split("v=")[-1].split("&")[0]

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
        text = " ".join([entry["text"] for entry in transcript])
        exec_time = time.time() - start_time
        return text, exec_time
    except Exception as e:
        return f"Error: {str(e)}", None

# ✅ Step 2: Ask Gemini to summarize dynamically
def summarize_transcript(text):
    prompt = f"""
You are an expert summarizer. Read the following video transcript and generate a high-quality summary that matches the level of detail necessary based on the actual **content density** — not the video length.

If the content is rich or technical, create a detailed explanation. If it's light or repetitive, make it short and concise. Avoid filler and capture only the valuable insights.

Transcript:
{text}
"""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        return response.text.strip() if response.text else "⚠️ No summary generated."
    except Exception as e:
        return f"Error: {str(e)}"

# ✅ Main CLI execution
if __name__ == "__main__":
    if len(sys.argv) > 1:
        youtube_url = sys.argv[1]
    else:
        youtube_url = input("Enter YouTube URL: ")

    print("[1] Extracting transcript...")
    transcript, exec_time = get_transcript(youtube_url)

    if "Error" in transcript:
        print("❌", transcript)
    else:
        print("✅ Transcript extracted in", f"{exec_time:.2f} sec\n")
        print("[2] Generating smart summary based on content...\n")
        summary = summarize_transcript(transcript)
        print("📝 Summary:\n")
        print(summary)
