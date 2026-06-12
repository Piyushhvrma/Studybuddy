const mongoose = require("mongoose");

const learningEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningEntry", learningEntrySchema);
