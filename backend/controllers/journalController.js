const JournalEntry = require("../models/JournalEntry");

// @desc    Add a journal entry
// @route   POST /api/journals
// @access  Private
const addJournalEntry = async (req, res) => {
  const { prompt, entryText } = req.body;

  if (!entryText || entryText.trim() === "") {
    return res.status(400).json({ message: "Entry text is required" });
  }

  const entry = await JournalEntry.create({
    user: req.user._id,
    prompt,
    entryText,
  });

  res.status(201).json(entry);
};

// @desc    Get all journal entries of user
// @route   GET /api/journals
// @access  Private
const getMyJournals = async (req, res) => {
  const entries = await JournalEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(entries);
};



// Existing: addJournalEntry, getMyJournals...

// ✅ NEW: Get latest journal entry
const getLatestJournal = async (req, res) => {
  try {
    const latest = await JournalEntry.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No journal entry found" });
    }

    res.json(latest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest journal" });
  }
};

module.exports = {
  addJournalEntry,
  getMyJournals,
  getLatestJournal,
};
