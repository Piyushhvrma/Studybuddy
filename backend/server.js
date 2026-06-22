const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

const allowedOrigin = process.env.CLIENT_URL || "*";

// Middleware
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

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
app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/api/room", require("./routes/room.routes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Momentum AI API is running 🚀" });
});

// Create HTTP server for Express + Socket.io
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket events
require("./socket/room.socket")(io);

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("🔌 Socket.io ready");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });