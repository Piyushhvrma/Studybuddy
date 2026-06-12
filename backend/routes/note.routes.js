const express = require("express");
const router = express.Router();
const { createNote, updateNote, deleteNote, getAllNotes } = require("../controllers/note.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, createNote);
router.put("/update/:id", authMiddleware, updateNote);
router.delete("/delete/:id", authMiddleware, deleteNote);
router.get("/getall", authMiddleware, getAllNotes);

module.exports = router;
