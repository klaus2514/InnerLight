const express = require("express");
const {
  addJournalEntry,
  getMyJournals,
  getLatestJournal,
} = require("../controllers/journalController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, addJournalEntry);
router.get("/", protect, getMyJournals);
router.get("/latest", protect, getLatestJournal);

module.exports = router;
