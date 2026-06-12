const express = require("express");
const router = express.Router();
const { chat, getChatHistory, clearHistory } = require("../controllers/ai.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/chat", authMiddleware, chat);
router.get("/history", authMiddleware, getChatHistory);
router.delete("/history", authMiddleware, clearHistory);

module.exports = router;
