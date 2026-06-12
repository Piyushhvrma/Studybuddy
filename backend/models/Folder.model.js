const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    folderName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", folderSchema);
