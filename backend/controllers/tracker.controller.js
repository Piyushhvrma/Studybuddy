const LearningEntry = require("../models/LearningEntry.model");
const User = require("../models/User.model");

// Helper: Update streak for a user
const updateStreak = async (userId) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const user = await User.findById(userId);
  if (!user) return;

  const lastDate = user.lastActiveDate;

  if (lastDate === today) {
    // Already logged today, no streak change
    return;
  }

  // Check if last active was yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak;
  if (lastDate === yesterdayStr) {
    newStreak = user.currentStreak + 1;
  } else {
    // Streak broken, reset to 1
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, user.longestStreak);

  await User.findByIdAndUpdate(userId, {
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: today,
  });
};

// @route POST /api/tracker/create
const createEntry = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const entry = await LearningEntry.create({
      userId: req.userId,
      title,
      description,
      date,
    });

    // Update streak
    await updateStreak(req.userId);

    res.status(201).json({ message: "Entry created!", entry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route PUT /api/tracker/update/:id
const updateEntry = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const entry = await LearningEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, date },
      { new: true }
    );

    if (!entry) return res.status(404).json({ message: "Entry not found." });

    res.json({ message: "Entry updated.", entry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route DELETE /api/tracker/delete/:id
const deleteEntry = async (req, res) => {
  try {
    const entry = await LearningEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!entry) return res.status(404).json({ message: "Entry not found." });

    res.json({ message: "Entry deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route GET /api/tracker/getall
const getAllEntries = async (req, res) => {
  try {
    const entries = await LearningEntry.find({ userId: req.userId }).sort({
      date: -1,
    });

    const user = await User.findById(req.userId).select("currentStreak longestStreak");

    res.json({ entries, currentStreak: user.currentStreak, longestStreak: user.longestStreak });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createEntry, updateEntry, deleteEntry, getAllEntries };
