const ChatMessage = require("../models/ChatMessage");
const axios = require("axios");
const analyzeEmotion = require("../utils/analyzeEmotion");

const talkToGPT = async (req, res) => {
  const userId = req.user._id;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "Message cannot be empty." });
  }

  try {
    await ChatMessage.create({ user: userId, role: "user", content: message });

    const history = await ChatMessage.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const messages = [
      {
        role: "system",
        content:
          "You are Lumi, a caring and gentle mental wellness chatbot. You validate feelings, ask gentle questions, and encourage self-care in a warm tone.",
      },
      ...history.reverse().map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    const { emoji, emotion } = analyzeEmotion(reply);

    await ChatMessage.create({
      user: userId,
      role: "assistant",
      content: reply,
      emoji,
      emotion,
    });

    res.json({ userMessage: message, botReply: reply, emoji, emotion });
  } catch (error) {
    console.error("Chat Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Chatbot failed to respond." });
  }
};

const getRecentChatPreview = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(2);

    res.json(messages.reverse());
  } catch (error) {
    console.error("Chat Preview Error:", error.message);
    res.status(500).json({ message: "Failed to fetch chat preview." });
  }
};

const clearChat = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ user: req.user._id });
    res.json({ message: "Chat cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear chat" });
  }
};

const getChatEmotionAnalytics = async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      user: req.user._id,
      role: "user",
    })
      .sort({ createdAt: -1 })
      .limit(15);

    const emotionCount = {
      anxious: 0,
      angry: 0,
      happy: 0,
      tired: 0,
      scared: 0,
    };

    for (const msg of messages) {
      const text = msg.content.toLowerCase();
      if (/sad|anxious|worried|lonely|depressed/.test(text)) emotionCount.anxious++;
      if (/angry|frustrated|irritated/.test(text)) emotionCount.angry++;
      if (/happy|grateful|joy|excited|love/.test(text)) emotionCount.happy++;
      if (/tired|exhausted|drained/.test(text)) emotionCount.tired++;
      if (/scared|fear|nervous/.test(text)) emotionCount.scared++;
    }

    const dominantEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0];

    res.json({
      emotion: dominantEmotion?.[0] || "neutral",
      message: `You're feeling ${dominantEmotion?.[0] || "neutral"} lately.`,
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ message: "Failed to fetch emotion analytics" });
  }
};

module.exports = {
  talkToGPT,
  getChatPreview: getRecentChatPreview,
  clearChat,
  getChatEmotionAnalytics,
  getRecentChatPreview,
};
