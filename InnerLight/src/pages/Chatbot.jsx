import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/Chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey there! How are you feeling today? 😊",
      emoji: "😊",
      createdAt: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = {
      role: "user",
      content: userInput,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/chat/ask",
        { message: userInput },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMsg = {
        role: "assistant",
        content: res.data.botReply,
        emoji: res.data.emoji || "🙂",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't respond. Please try again later.",
          emoji: "⚠️",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("/api/chat/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([
        {
          role: "assistant",
          content: "Hey there! How are you feeling today? 😊",
          emoji: "😊",
          createdAt: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header bg-success text-white p-3 d-flex justify-content-between">
        <h4 className="m-0">🤖 InnerLight Chatbot</h4>
        <button className="btn btn-sm btn-light" onClick={handleClearChat}>
          Clear Chat
        </button>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <div className="text">
              {msg.emoji && msg.role === "assistant" && <span>{msg.emoji} </span>}
              {msg.content}
            </div>
            <div className="timestamp text-muted small">
              {formatTime(msg.createdAt)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="text">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input d-flex">
        <input
          className="form-control"
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={loading}
        />
        <button className="btn btn-success ms-2" type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
