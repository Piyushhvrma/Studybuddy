const Material = require("../models/Material.model");
const { cloudinary } = require("../config/cloudinary");

// @route POST /api/material/upload
const uploadMaterial = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required." });

    const ext = req.file.originalname.split(".").pop().toLowerCase();

    const material = await Material.create({
      userId: req.userId,
      title,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      fileType: ext,
    });

    res.status(201).json({ message: "Material uploaded.", material });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route DELETE /api/material/delete/:id
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!material) return res.status(404).json({ message: "Material not found." });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(material.publicId, { resource_type: "raw" });

    res.json({ message: "Material deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route GET /api/material/getall
const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ materials });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { uploadMaterial, deleteMaterial, getAllMaterials };
