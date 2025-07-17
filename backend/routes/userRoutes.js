const express = require("express");
const { registerUser, loginUser , getMe, getUserById, getFriendsByIds} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Registration Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

// User dashboard info
router.get("/me", protect, getMe);

// getuser and friendList
router.get("/:id", protect, getUserById);
router.post("/friends", protect, getFriendsByIds);

module.exports = router;
