const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login };
