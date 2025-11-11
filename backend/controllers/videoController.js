const axios = require("axios");

const summarizeVideo = async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Video URL is required." });
  }

  try {
    console.log("Received video URL:", videoUrl);

    const response = await axios.post(
      "http://localhost:5001/summarize_video",
      { videoUrl },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Flask:", response.data);

    if (response.data.success) {
      res.json({ success: true, summary: response.data.summary });
    } else {
      res.status(500).json({ success: false, message: response.data.message });
    }
  } catch (error) {
    console.error("Error summarizing video:", error);
    res.status(500).json({
      success: false,
      message: "Failed to summarize video",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { summarizeVideo };
