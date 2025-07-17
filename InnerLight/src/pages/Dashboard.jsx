import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MoodLogger from "../components/MoodLogger";
import MoodChart from "../components/MoodChart";
import SmartSuggestion from "../components/SmartSuggestion";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [quote, setQuote] = useState("");
  const [latestJournal, setLatestJournal] = useState(null);
  const [chatPreview, setChatPreview] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      try {
        const userRes = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        try {
          const quoteRes = await axios.get("http://localhost:5000/api/quote");
          setQuote(quoteRes.data[0]?.q + " — " + quoteRes.data[0]?.a);
        } catch {
          setQuote("You are doing the best you can — and that’s enough. 💚");
        }

        try {
          const journalRes = await axios.get("http://localhost:5000/api/journals/latest", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLatestJournal(journalRes.data);
        } catch (err) {
          console.error("Error fetching latest journal", err);
        }

        try {
          const chatRes = await axios.get("http://localhost:5000/api/chat/preview", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setChatPreview(chatRes.data);
        } catch (err) {
          console.error("Failed to fetch chat preview", err);
        }

      } catch (err) {
        console.error("User fetch failed", err);
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container py-5 vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">Welcome, {user?.name?.split(" ")[0]} 👋</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Mood Logger and Mood Chart */}
      <MoodLogger onMoodLogged={() => setRefresh(!refresh)} />
      <MoodChart refresh={refresh} />

      {/* Quick Links */}
      <div className="row text-center mb-4">
        {[
          { label: "Journaling", path: "/journal", icon: "📔" },
          { label: "Community", path: "/forum", icon: "👥" },
          { label: "Chatbot", path: "/chat", icon: "🤖" },
          { label: "Self-Help", path: "/library", icon: "📚" },
        ].map((item) => (
          <div className="col-6 col-md-3 mb-3" key={item.path}>
            <button
              className="btn btn-outline-success w-100"
              onClick={() => navigate(item.path)}
            >
              {item.icon} <br />
              {item.label}
            </button>
          </div>
        ))}
      </div>

      {/* Smart Suggestion */}
      <SmartSuggestion />

      {/* Latest Journal Preview */}
      {latestJournal && (
        <div className="card shadow p-4 mb-4">
          <h5 className="mb-2 text-success">📔 Latest Journal Entry</h5>
          <small className="text-muted">
            {new Date(latestJournal.createdAt).toLocaleString()}
          </small>
          {latestJournal.prompt && (
            <p className="mt-2">
              <strong>Prompt:</strong> {latestJournal.prompt}
            </p>
          )}
          <p>
            {latestJournal.entryText.length > 200
              ? latestJournal.entryText.slice(0, 200) + "..."
              : latestJournal.entryText}
          </p>
          <button
            className="btn btn-outline-success btn-sm mt-2"
            onClick={() => navigate("/journal")}
          >
            View All Entries
          </button>
        </div>
      )}

      {/* Chat Preview */}
      {chatPreview.length > 0 && (
        <div className="card shadow p-4 mb-4">
          <h5 className="text-success mb-2">🤖 Recent Chat with Lumi</h5>
          {chatPreview.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-primary" : "text-dark"}`}>
              <strong>{msg.role === "user" ? "You:" : "Lumi:"}</strong>{" "}
              {msg.content.length > 150 ? msg.content.slice(0, 150) + "..." : msg.content}
              <div className="text-muted small">
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline-success btn-sm mt-2"
            onClick={() => navigate("/chat")}
          >
            Open Chat
          </button>
        </div>
      )}

      {/* Quote */}
      <div className="alert alert-success text-center mt-3">
        <strong>Daily Inspiration:</strong> <br />
        {quote}
      </div>
    </div>
  );
}

export default Dashboard;
