const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Note = require("../models/Note");

const generateNotes = async (req, res) => {
  console.log("File received:", req.file);
  console.log("Body received:", req.body);
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  const { topic, detailLevel, userId } = req.body;

  if (!topic) {
    return res
      .status(400)
      .json({ success: false, message: "Topic is required" });
  }

  try {
    const formData = new FormData();
    const fileStream = fs.createReadStream(req.file.path);
    formData.append("file", fileStream, req.file.originalname);
    formData.append("topic", topic);
    formData.append("detailLevel", detailLevel);
    formData.append("userId", userId);
    console.log("Sending request to generate_notes endpoint...", {
      filename: req.file.originalname,
      topic,
      detailLevel,
      userId,
    });
    console.log("Sending request to generate_notes endpoint...", {
      topic,
      detailLevel,
      userId,
      filePath: req.file.path,
    });

    const response = await axios.post(
      "http://localhost:5001/generate_notes",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    console.log("Response from generate_notes endpoint:", response.data);

    // Clean up the temporary file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });

    if (response.data.success) {
      const newNote = new Note({
        topic,
        detail_level: detailLevel,
        user_id: userId,
        notes: response.data.notes,
      });

      await newNote.save();
      res.json({ success: true, notes: response.data.notes });
    } else {
      res.status(500).json({ success: false, message: response.data.message });
    }
  } catch (error) {
    console.error("Error generating notes:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate notes" });
  }
};

module.exports = { generateNotes };
