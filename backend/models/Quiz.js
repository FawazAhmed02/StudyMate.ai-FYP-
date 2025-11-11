const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  type: { type: String, required: true },
  difficulty: { type: String, required: true },
  user_id: { type: String, required: true },
  correct_attempts: { type: Number, required: true }, // New field for correct attempts
  wrong_attempts: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
