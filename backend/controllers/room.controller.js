const Room = require("../models/Room.model");
const User = require("../models/User.model");

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @route POST /api/room/create
const createRoom = async (req, res) => {
  try {
    const { title, description } = req.body;

    const user = await User.findById(req.userId).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let roomCode;
    let exists = true;

    while (exists) {
      roomCode = generateRoomCode();
      exists = await Room.findOne({ roomCode });
    }

    const room = await Room.create({
      roomCode,
      title: title || "Study Room",
      description: description || "",
      createdBy: req.userId,
      members: [
        {
          userId: req.userId,
          name: user.name,
          email: user.email,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully.",
      room,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// @route POST /api/room/join
const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({ message: "Room code is required." });
    }

    const user = await User.findById(req.userId).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const room = await Room.findOne({
      roomCode: roomCode.toUpperCase(),
    });

    if (!room) {
      return res.status(404).json({ message: "Invalid room code." });
    }

    const alreadyMember = room.members.some(
      (member) => member.userId.toString() === req.userId.toString()
    );

    if (!alreadyMember) {
      room.members.push({
        userId: req.userId,
        name: user.name,
        email: user.email,
      });

      await room.save();
    }

    res.json({
      success: true,
      message: "Joined room successfully.",
      room,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// @route GET /api/room/:roomCode
const getRoomByCode = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const room = await Room.findOne({
      roomCode: roomCode.toUpperCase(),
    }).populate("createdBy", "name email");

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    res.json({
      success: true,
      room,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getRoomByCode,
};