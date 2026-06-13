
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/tracker", require("./routes/tracker.routes"));
app.use("/api/folder", require("./routes/folder.routes"));
app.use("/api/note", require("./routes/note.routes"));
app.use("/api/material", require("./routes/material.routes"));
app.use("/api/ai", require("./routes/ai.routes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Momentum AI API is running 🚀" });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
