// components/Chat/ChatInput.jsx
import { useState } from "react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mt-3">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Type your thoughts..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="btn btn-success" type="submit">
        Send
      </button>
    </form>
  );
}

export default ChatInput;
