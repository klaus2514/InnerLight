const MoodEntry = require("../models/MoodEntry");

// @desc    Add mood for current day
// @route   POST /api/moods
// @access  Private
const addMood = async (req, res) => {
  const { moodLevel, note } = req.body;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of day

  const existingMood = await MoodEntry.findOne({
    user: req.user._id,
    date: { $gte: today },
  });

  if (existingMood) {
    return res.status(400).json({ message: "Mood already logged for today" });
  }

  const mood = await MoodEntry.create({
    user: req.user._id,
    moodLevel,
    note,
    date: new Date(),
  });

  res.status(201).json(mood);
};

// @desc    Get all mood entries (recent first)
// @route   GET /api/moods
// @access  Private
const getMyMoods = async (req, res) => {
  const moods = await MoodEntry.find({ user: req.user._id }).sort({ date: -1 });
  res.json(moods);
};

// ✅ NEW: Mood History route
// @desc    Get mood history (for analytics)
// @route   GET /api/moods/history
// @access  Private
const getMoodHistory = async (req, res) => {
  const moods = await MoodEntry.find({ user: req.user._id }).sort({ date: 1 }); // oldest to newest
  res.json(moods);
};

module.exports = {
  addMood,
  getMyMoods,
  getMoodHistory,
};
