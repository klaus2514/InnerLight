const express = require("express");
const router = express.Router();
const { addMood, getMyMoods, getMoodHistory } = require("../controllers/moodController");
const { protect } = require("../middlewares/authMiddleware");

// Protected mood routes
router.post("/", protect, addMood);
router.get("/", protect, getMyMoods);
router.get("/history", protect, getMoodHistory);

module.exports = router;
