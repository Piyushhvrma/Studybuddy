const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profilePic: {
      type: String,
      default: "",
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: "" }, // YYYY-MM-DD
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
