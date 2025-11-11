import React, { useState } from "react";
import { API_ENDPOINTS } from "../../config/api";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
}

const Quiz: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [quizType, setQuizType] = useState<string>("mcq");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
    setError(null);
  };

  const handleQuizTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuizType(event.target.value);
  };

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDifficulty(event.target.value);
  };

  const handleGenerateQuiz = async () => {
    const storedStudent = localStorage.getItem("student");
    const username = storedStudent ? JSON.parse(storedStudent).name : "guest";
    if (!file || !topic) {
      setError("Please upload a PDF file and specify a topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setQuiz([]);
    setSubmitted(false);
    setScore(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("topic", topic);
    formData.append("quizType", quizType);
    formData.append("difficulty", difficulty);
    formData.append("userId", username);

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_QUIZ, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const parsedQuiz = parseQuiz(data.quiz);
        setQuiz(parsedQuiz);
      } else {
        setError(data.message || "Failed to generate quiz.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseQuiz = (quizText: string): Question[] => {
    const questions: Question[] = [];
    const lines = quizText.split("\n").filter((line) => line.trim());
    let currentQuestion: Question = {
      question: "",
      options: [],
      correctAnswer: "",
      selectedAnswer: null,
    };

    lines.forEach((line) => {
      if (line.startsWith("Q")) {
        if (currentQuestion.question) {
          questions.push({ ...currentQuestion });
        }
        currentQuestion = {
          question: line.substring(line.indexOf(".") + 1).trim(),
          options: [],
          correctAnswer: "",
          selectedAnswer: null,
        };
      } else if (
        line.startsWith("A)") ||
        line.startsWith("B)") ||
        line.startsWith("C)") ||
        line.startsWith("D)")
      ) {
        currentQuestion.options.push(
          line.substring(line.indexOf(")") + 1).trim()
        );
      } else if (line.startsWith("Answer:")) {
        const answerText = line.replace("Answer:", "").trim();
        if (quizType === "mcq") {
          const answerIndex = "ABCD".indexOf(answerText);
          if (
            answerIndex !== -1 &&
            answerIndex < currentQuestion.options.length
          ) {
            currentQuestion.correctAnswer =
              currentQuestion.options[answerIndex];
          }
        } else if (quizType === "true_false") {
          currentQuestion.options = ["True", "False"];
          currentQuestion.correctAnswer = answerText;
        } else {
          currentQuestion.correctAnswer = answerText;
        }
      }
    });

    if (currentQuestion.question) {
      questions.push({ ...currentQuestion });
    }

    return questions;
  };

  const handleAnswerChange = (index: number, answer: string) => {
    setQuiz((prevQuiz) =>
      prevQuiz.map((q, i) =>
        i === index ? { ...q, selectedAnswer: answer } : q
      )
    );
  };

  const handleSubmitQuiz = () => {
    const correctCount = quiz.filter(
      (q) =>
        q.selectedAnswer?.trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase()
    ).length;
    const wrongCount = quiz.length - correctCount;
    setScore(correctCount);
    setSubmitted(true);

    const quizResultData = {
      topic,
      quizType,
      difficulty,
      userId: localStorage.getItem("student")
        ? JSON.parse(localStorage.getItem("student")!).name
        : "guest", // Retrieve user ID correctly
      correct_attempts: correctCount, // Include correct attempts
      wrong_attempts: wrongCount, // Include wrong attempts
    };
    fetch(API_ENDPOINTS.SUBMIT_QUIZ, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizResultData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Quiz results submitted successfully");
        } else {
          console.error("Failed to submit quiz results:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error submitting quiz results:", error);
      });
  };

  const renderQuestion = (q: Question, index: number) => {
    const isMultipleChoice = quizType === "mcq" || quizType === "true_false";
    const isCorrect =
      submitted &&
      q.selectedAnswer?.trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase();
    const isAnswered = q.selectedAnswer !== null;

    return (
      <div
        key={index}
        className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <p className="font-semibold mb-3 text-lg text-gray-800">{`${
          index + 1
        }. ${q.question}`}</p>
        <div className="space-y-2">
          {isMultipleChoice ? (
            q.options.map((option, optIndex) => {
              const isSelected = q.selectedAnswer === option;
              const isOptionCorrect =
                option.trim().toLowerCase() ===
                q.correctAnswer.trim().toLowerCase();

              return (
                <label
                  key={optIndex}
                  className={`flex items-center p-3 rounded-md cursor-pointer transition-all
                    ${!submitted && "hover:bg-gray-50"}
                    ${
                      submitted &&
                      isSelected &&
                      isOptionCorrect &&
                      "bg-green-50"
                    }
                    ${
                      submitted && isSelected && !isOptionCorrect && "bg-red-50"
                    }
                    ${submitted ? "cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(index, option)}
                    disabled={submitted}
                    className="mr-3"
                  />
                  <span
                    className={`flex-grow text-gray-800 ${
                      submitted && isSelected && isOptionCorrect
                        ? "text-green-700"
                        : submitted && isSelected && !isOptionCorrect
                        ? "text-red-700"
                        : ""
                    }`}
                  >
                    {option}
                  </span>
                  {submitted && isSelected && (
                    <span className="ml-2">{isOptionCorrect ? "✓" : "✗"}</span>
                  )}
                </label>
              );
            })
          ) : (
            <div>
              <input
                type="text"
                value={q.selectedAnswer || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                disabled={submitted}
                placeholder="Type your answer..."
                className={`w-full p-3 rounded-md border text-gray-800 ${
                  submitted && isCorrect
                    ? "bg-green-50 border-green-500"
                    : submitted && isAnswered
                    ? "bg-red-50 border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {submitted && (
                <p
                  className={`mt-2 ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Correct answer: {q.correctAnswer}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 bg-white shadow rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Quiz Generation
          </h2>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-gray-800"
          />
          <input
            type="text"
            value={topic}
            onChange={handleTopicChange}
            placeholder="Enter chapter/topic name..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-gray-800"
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Quiz Type
              </label>
              <select
                value={quizType}
                onChange={handleQuizTypeChange}
                className="w-full mt-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none text-gray-800"
              >
                <option value="mcq">Multiple Choice</option>
                <option value="true_false">True/False</option>
                <option value="fill_in_the_blanks">Fill in the Blanks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={handleDifficultyChange}
                className="w-full mt-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none text-gray-800"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerateQuiz}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Generating Quiz..." : "Generate Quiz"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="lg:w-1/2 bg-white shadow rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Generated Quiz
          </h3>
          {quiz.length > 0 ? (
            <form className="space-y-6">
              {quiz.map((q, index) => renderQuestion(q, index))}
              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition duration-200"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-xl font-semibold text-blue-800">
                    Your Score: {score} / {quiz.length}
                  </p>
                  <p className="text-blue-600 mt-2">
                    {((score / quiz.length) * 100).toFixed(0)}% Correct
                  </p>
                </div>
              )}
            </form>
          ) : (
            <p className="text-gray-500">No quiz generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
