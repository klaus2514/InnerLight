// components/SmartSuggestion.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function SmartSuggestion() {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/ai/suggestion", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuggestion(res.data.message);
      } catch (err) {
        setSuggestion("Unable to fetch suggestion at the moment.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, []);

  return (
    <div className="card shadow p-4 mb-4">
      <h5 className="mb-3 text-success">💡 Smart AI Suggestion</h5>
      {loading ? (
        <p>Thinking...</p>
      ) : (
        <p>{suggestion}</p>
      )}
    </div>
  );
}

export default SmartSuggestion;
