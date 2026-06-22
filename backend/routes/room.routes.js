const express = require("express");
const router = express.Router();

const {
  createRoom,
  joinRoom,
  getRoomByCode,
} = require("../controllers/room.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);
router.get("/:roomCode", authMiddleware, getRoomByCode);

module.exports = router;