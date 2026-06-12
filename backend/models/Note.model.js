const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
