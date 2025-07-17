const Post = require("../models/Post");

// Create a new post
const createPost = async (req, res) => {
  const { content, tags } = req.body;

  try {
    const post = await Post.create({
      user: req.user._id,
      content,
      tags,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// Get all posts (latest first)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Like/unlike a post
const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(req.user._id);
    if (liked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ message: liked ? "Unliked" : "Liked" });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Failed to like/unlike post" });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Get comments of a post (from embedded array)
const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments.user", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post.comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// ✅ Get posts created by a specific user
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching user's posts:", err);
    res.status(500).json({ message: "Failed to fetch user's posts" });
  }
};


module.exports = {
  createPost,
  getAllPosts,
  toggleLikePost,
  addComment,
  getComments,
  getUserPosts,
};
