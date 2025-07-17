import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Journal.css";
import { useNavigate } from "react-router-dom";

function Journal() {
  const [prompt, setPrompt] = useState("");
  const [entryText, setEntryText] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/journals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch journal entries", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!entryText.trim()) {
      setError("Entry cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/journals",
        { prompt, entryText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEntryText("");
      setPrompt("");
      fetchEntries(); // refresh entries
    } catch (err) {
      console.error("Failed to submit entry", err);
      setError("Could not save journal. Try again.");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="journal-container">
      <div className="journal-card">
        <h2 className="journal-title">📔 My Journal</h2>

        <form onSubmit={handleSubmit} className="journal-form">
          <div className="prompt-area">
            <label>Guided Prompt (optional):</label>
            <input
              type="text"
              placeholder="e.g. What made me smile today?"
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <textarea
            className="entry-textarea"
            placeholder="Write your thoughts here..."
            rows={8}
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
          ></textarea>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="ribbon-button">
            Save Entry
          </button>
        </form>
      </div>

      {/* Previous entries */}
      <div className="entry-history">
        <h4 className="history-title">📜 Past Entries</h4>
        {entries.length === 0 && (
          <p className="text-muted">No entries yet. Start writing!</p>
        )}
        {entries.map((entry) => (
          <div className="journal-entry" key={entry._id}>
            <div className="entry-header">
              <span className="ribbon-tag">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </div>
            {entry.prompt && (
              <p className="prompt-highlight">Prompt: {entry.prompt}</p>
            )}
            <p className="entry-body">{entry.entryText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Journal;
