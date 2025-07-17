import { useState } from "react";
import axios from "axios";

function MoodLogger({ onMoodLogged }) {
  const [moodLevel, setMoodLevel] = useState(3);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/moods", {
        moodLevel,
        note,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus("success");
      setNote("");
      if (onMoodLogged) onMoodLogged(); // trigger chart refresh
    } catch (err) {
      if (err.response?.data?.message === "Mood already logged for today") {
        setStatus("already");
      } else {
        setStatus("error");
      }
      console.error("Mood logging failed:", err);
    }
  };

  return (
    <div className="card shadow p-4 mb-4">
      <h4 className="text-primary">How are you feeling today?</h4>

      <input
        type="range"
        min="1"
        max="5"
        value={moodLevel}
        onChange={(e) => setMoodLevel(parseInt(e.target.value))}
        className="form-range my-3"
      />

      <div className="mb-2">
        Mood Level: <strong>{moodLevel}</strong> {["😢", "😞", "😐", "🙂", "😊"][moodLevel - 1]}
      </div>

      <textarea
        className="form-control mb-3"
        placeholder="Add a note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows="2"
      />

      <button className="btn btn-success" onClick={handleSubmit}>
        Submit Mood
      </button>

      {status === "success" && <p className="text-success mt-2">Mood logged successfully!</p>}
      {status === "already" && <p className="text-warning mt-2">You've already submitted today's mood.</p>}
      {status === "error" && <p className="text-danger mt-2">Something went wrong.</p>}
    </div>
  );
}

export default MoodLogger;
