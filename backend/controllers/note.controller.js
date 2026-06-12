const Note = require("../models/Note.model");

// @route POST /api/note/create
const createNote = async (req, res) => {
  try {
    const { folderId, title, content } = req.body;
    if (!folderId || !title || !content) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const note = await Note.create({ userId: req.userId, folderId, title, content });
    res.status(201).json({ message: "Note created.", note });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route PUT /api/note/update/:id
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, content },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found." });
    res.json({ message: "Note updated.", note });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route DELETE /api/note/delete/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found." });
    res.json({ message: "Note deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route GET /api/note/getall?folderId=xxx
const getAllNotes = async (req, res) => {
  try {
    const { folderId } = req.query;
    const query = { userId: req.userId };
    if (folderId) query.folderId = folderId;

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createNote, updateNote, deleteNote, getAllNotes };
