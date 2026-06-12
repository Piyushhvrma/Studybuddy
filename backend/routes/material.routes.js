const express = require("express");
const router = express.Router();
const { uploadMaterial, deleteMaterial, getAllMaterials } = require("../controllers/material.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary");

router.post("/upload", authMiddleware, upload.single("file"), uploadMaterial);
router.delete("/delete/:id", authMiddleware, deleteMaterial);
router.get("/getall", authMiddleware, getAllMaterials);

module.exports = router;
