const express = require("express");
const router = express.Router();
const { getOverview } = require("../controllers/analytics.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/overview", authMiddleware, getOverview);

module.exports = router;