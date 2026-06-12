const express = require("express");
const router = express.Router();
const { createEntry, updateEntry, deleteEntry, getAllEntries } = require("../controllers/tracker.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, createEntry);
router.put("/update/:id", authMiddleware, updateEntry);
router.delete("/delete/:id", authMiddleware, deleteEntry);
router.get("/getall", authMiddleware, getAllEntries);

module.exports = router;
