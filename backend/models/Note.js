const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  detail_level: { type: String, required: true },
  user_id: { type: String, required: true },
  notes: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
