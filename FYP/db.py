import pandas as pd
import matplotlib.pyplot as plt
from pymongo import MongoClient

# --- MongoDB Connection ---
client = MongoClient("mongodb://localhost:27017/")  # adjust URI if hosted elsewhere
db = client["quiz_dashboard"]  # your database name
collection = db["attempts"]     # your collection name

# --- Target User ---
user_name = "Fawaz Ahmed"  # change as needed

# --- Fetch Data from MongoDB ---
user_data = list(collection.find({"user id": user_name}))

if not user_data:
    print(f"No quiz data found for user: {user_name}")
else:
    # Convert to DataFrame
    df = pd.DataFrame(user_data)
    
    # Convert created_at to datetime if it's in string format
    if "created_at" in df.columns:
        df["created_at"] = pd.to_datetime(df["created_at"])
    else:
        print("❌ 'created_at' field is missing from MongoDB documents.")
        exit()

    # --- Print Summary ---
    total_quiz = len(df)
    total_correct = df["correct_attempts"].sum()
    total_wrong = df["wrong_attempts"].sum()
    total_questions = total_correct + total_wrong

    print(f"\n📊 Quiz Summary for {user_name}")
    print(f"Total Quiz Attempted      : {total_quiz}")
    print(f"Total Correct Attempts    : {total_correct}")
    print(f"Total Wrong Attempts      : {total_wrong}")
    print(f"Total Question Attempts   : {total_questions}")

    # --- Visualization 1: Pie Chart - Correct vs Wrong ---
    plt.figure(figsize=(5, 5))
    plt.pie([total_correct, total_wrong], labels=["Correct", "Wrong"], autopct="%1.1f%%", colors=["green", "red"])
    plt.title(f"{user_name} - Overall Accuracy")
    plt.tight_layout()
    plt.show()

    # --- Visualization 2: Bar Chart - Performance by Topic ---
    topic_perf = df.groupby("topic")[["correct_attempts", "wrong_attempts"]].sum()
    topic_perf.plot(kind="bar", stacked=True, figsize=(8, 5), color=["green", "red"])
    plt.title(f"{user_name} - Performance by Topic")
    plt.xlabel("Topic")
    plt.ylabel("Attempts")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

    # --- Visualization 3: Bar Chart - Question Count by Difficulty ---
    difficulty_counts = df["difficulty"].value_counts()
    difficulty_counts.plot(kind="bar", color="skyblue", figsize=(6, 4))
    plt.title(f"{user_name} - Question Difficulty Distribution")
    plt.xlabel("Difficulty")
    plt.ylabel("Count")
    plt.tight_layout()
    plt.show()

    # --- Visualization 4: Line Chart - Activity Over Time ---
    time_series = df.set_index("created_at").resample("D")[["correct_attempts", "wrong_attempts"]].sum()
    time_series.plot(figsize=(8, 4), marker="o")
    plt.title(f"{user_name} - Quiz Attempts Over Time")
    plt.xlabel("Date")
    plt.ylabel("Attempts")
    plt.tight_layout()
    plt.show()
