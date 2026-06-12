const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: { type: String, required: true }, // pdf, ppt, docx
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
