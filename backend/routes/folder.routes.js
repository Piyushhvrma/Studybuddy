// folder.routes.js
const express = require("express");
const router = express.Router();
const { createFolder, updateFolder, deleteFolder, getAllFolders } = require("../controllers/folder.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, createFolder);
router.put("/update/:id", authMiddleware, updateFolder);
router.delete("/delete/:id", authMiddleware, deleteFolder);
router.get("/getall", authMiddleware, getAllFolders);

module.exports = router;
