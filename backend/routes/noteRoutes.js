const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { generateNotes } = require("../controllers/noteController");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST endpoint for note generation with file upload
router.post("/generate", upload.single("file"), generateNotes);

module.exports = router;
