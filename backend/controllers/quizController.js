const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Quiz = require("../models/Quiz");

const generateQuiz = async (req, res) => {
  const file = req.file;
  const { topic, quizType, difficulty, userId } = req.body;
  //const userId = req.user?.username || "guest";

  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: "File is required." });
  }
  if (!topic) {
    return res
      .status(400)
      .json({ success: false, message: "Topic is required." });
  }

  try {
    console.log("Received file:", file.originalname);
    console.log("Received topic:", topic);

    const formData = new FormData();
    const fileStream = fs.createReadStream(file.path);
    formData.append("file", fileStream, file.originalname);
    formData.append("topic", topic);
    formData.append("quizType", quizType || "true_false");
    formData.append("difficulty", difficulty || "medium");
    formData.append("userId", userId);

    const response = await axios.post(
      "http://localhost:5001/generate_quiz",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // Clean up the uploaded file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    if (response.data.success) {
      res.status(200).json(response.data);
    } else {
      res.status(500).json({ success: false, message: response.data.message });
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate quiz." });
  }
};

const submitQuiz = async (req, res) => {
  const {
    topic,
    quizType,
    difficulty,
    userId,
    correct_attempts,
    wrong_attempts,
  } = req.body;
  try {
    const newQuiz = new Quiz({
      topic,
      type: quizType,
      difficulty,
      user_id: userId,
      correct_attempts,
      wrong_attempts,
    });
    await newQuiz.save();
    res
      .status(200)
      .json({ success: true, message: "Quiz results saved successfully." });
  } catch (error) {
    console.error("Error saving quiz results:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save quiz results." });
  }
};

module.exports = { generateQuiz, submitQuiz };
