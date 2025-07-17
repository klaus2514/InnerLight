import { useEffect, useState } from "react";
import axios from "axios";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/forum/${postId}/comments`
        );
        setComments(res.data);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/forum/${postId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, res.data.comment]);
      setText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <div className="mt-3">
      <h6>💬 Comments</h6>
      {comments.map((c, i) => (
        <div key={i} className="border-start ps-2 mb-2">
          <strong>{c.user.name}</strong>: {c.text}
        </div>
      ))}
      <div className="d-flex mt-2">
        <input
          className="form-control me-2"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-outline-success" onClick={handleAddComment}>
          Add
        </button>
      </div>
    </div>
  );
}

export default CommentSection;
