// src/components/ChatPopup.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ChatPopup({ messages = [], onClose }) {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState(messages);

  useEffect(() => {
    setChat(messages);
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      // Optionally emit a message via socket here
      setChat((prev) => [...prev, { from: "You", text: input }]);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-xl border z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="text-sm font-medium text-gray-700">Messages</h3>
        <button onClick={onClose}>
          <X size={18} className="text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 max-h-64">
        {chat.length === 0 ? (
          <p className="text-sm text-gray-500">No messages yet.</p>
        ) : (
          chat.map((msg, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium text-gray-800">{msg.from}:</span>{" "}
              <span className="text-gray-700">{msg.text}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center border-t p-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring focus:border-green-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="ml-2 text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
