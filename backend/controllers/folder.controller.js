const Folder = require("../models/Folder.model");
const Note = require("../models/Note.model");

// @route POST /api/folder/create
const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    if (!folderName) return res.status(400).json({ message: "Folder name required." });

    const exists = await Folder.findOne({ userId: req.userId, folderName });
    if (exists) return res.status(400).json({ message: "Folder already exists." });

    const folder = await Folder.create({ userId: req.userId, folderName });
    res.status(201).json({ message: "Folder created.", folder });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route PUT /api/folder/update/:id
const updateFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { folderName },
      { new: true }
    );
    if (!folder) return res.status(404).json({ message: "Folder not found." });
    res.json({ message: "Folder updated.", folder });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route DELETE /api/folder/delete/:id
const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!folder) return res.status(404).json({ message: "Folder not found." });

    // Delete all notes in this folder
    await Note.deleteMany({ folderId: req.params.id, userId: req.userId });

    res.json({ message: "Folder and its notes deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route GET /api/folder/getall
const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.userId }).sort({ createdAt: -1 });

    // Add note count per folder
    const foldersWithCount = await Promise.all(
      folders.map(async (folder) => {
        const noteCount = await Note.countDocuments({ folderId: folder._id });
        return { ...folder.toObject(), noteCount };
      })
    );

    res.json({ folders: foldersWithCount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createFolder, updateFolder, deleteFolder, getAllFolders };
