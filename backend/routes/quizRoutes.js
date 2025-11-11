const express = require("express");
const router = express.Router();
const { generateQuiz, submitQuiz } = require("../controllers/quizController");
const multer = require("multer");

// Configure multer for PDF uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

router.post("/generate", upload.single("file"), generateQuiz);
router.post('/submit', submitQuiz);

module.exports = router;
