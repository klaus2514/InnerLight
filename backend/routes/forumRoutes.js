const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  toggleLikePost,
  addComment,
  getComments,
  getUserPosts
} = require("../controllers/forumController");

const { protect } = require("../middlewares/authMiddleware");

// -------- Post Routes --------
router.post("/", protect, createPost);              // Create post
router.get("/", getAllPosts);          
router.get("/user/:userId", protect, getUserPosts);              // Get all posts
router.put("/:id/like", protect, toggleLikePost);   // Like/unlike a post

// -------- Comment Routes (embedded) --------
router.post("/:id/comments", protect, addComment);  // Add comment
router.get("/:id/comments", getComments);           // Get comments of a post



module.exports = router;
