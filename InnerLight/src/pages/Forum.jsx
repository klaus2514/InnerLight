import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import CreatePost from "../components/CreatePost";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/");

    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/forum");
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate, token]);

  const handleLike = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/forum/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(user._id)
                  ? post.likes.filter((id) => id !== user._id)
                  : [...post.likes, user._id],
              }
            : post
        )
      );
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="text-success mb-4">👥 Community Forum</h3>

      <CreatePost onPostCreated={(newPost) => setPosts([newPost, ...posts])} />

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="card mb-3 p-3 shadow-sm">
            <div className="d-flex justify-content-between">
              <strong>{post.user.name}</strong>
              <small className="text-muted">
                {new Date(post.createdAt).toLocaleString()}
              </small>
            </div>
            <p className="mt-2">{post.content}</p>
            <div className="mb-2">
              {post.tags.map((tag, i) => (
                <span key={i} className="badge bg-secondary me-1">
                  #{tag}
                </span>
              ))}
            </div>

            <button
              className="btn btn-sm btn-outline-success me-2"
              onClick={() => handleLike(post._id)}
            >
              ❤️ {post.likes.length} Likes
            </button>

            <CommentSection postId={post._id} />
          </div>
        ))
      )}
    </div>
  );
}

export default Forum;
