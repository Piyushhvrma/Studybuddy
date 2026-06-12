const User = require("../models/User.model");
const LearningEntry = require("../models/LearningEntry.model");
const Note = require("../models/Note.model");
const Material = require("../models/Material.model");
const { cloudinary } = require("../config/cloudinary");

// @route GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    const totalNotes = await Note.countDocuments({ userId: req.userId });
    const totalMaterials = await Material.countDocuments({ userId: req.userId });
    const totalEntries = await LearningEntry.countDocuments({ userId: req.userId });

    res.json({ user, totalNotes, totalMaterials, totalEntries });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = {};
    if (name) updateData.name = name;

    // Handle profile pic upload
    if (req.file) {
      updateData.profilePic = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      select: "-password",
    });

    res.json({ message: "Profile updated.", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
