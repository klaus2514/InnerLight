const express = require("express");
const router = express.Router();
const {
  talkToGPT,
  getChatPreview,
  clearChat,
  getChatEmotionAnalytics,
} = require("../controllers/chatbotController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/ask", protect, talkToGPT);
router.get("/preview", protect, getChatPreview);
router.delete("/clear", protect, clearChat);
router.get("/emotion", protect, getChatEmotionAnalytics);

module.exports = router;
