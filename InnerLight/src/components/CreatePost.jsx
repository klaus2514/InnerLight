import { useState } from "react";
import axios from "axios";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/forum",
        { content, tags: tags.split(",").map((t) => t.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostCreated(res.data);
      setContent("");
      setTags("");
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="form-control mb-2"
        placeholder="What's on your mind?"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button className="btn btn-success" type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

export default CreatePost;
