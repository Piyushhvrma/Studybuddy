const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary");

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("profilePic"), updateProfile);

module.exports = router;
