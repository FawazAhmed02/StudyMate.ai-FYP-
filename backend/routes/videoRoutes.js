const express = require("express");
const router = express.Router();
const { summarizeVideo } = require("../controllers/videoController");

router.post("/summarize", summarizeVideo);

module.exports = router;
