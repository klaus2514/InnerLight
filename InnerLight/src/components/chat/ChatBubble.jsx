// components/Chat/ChatBubble.jsx
function ChatBubble({ message, isUser }) {
  return (
    <div className={`d-flex ${isUser ? "justify-content-end" : "justify-content-start"} mb-2`}>
      <div
        className={`p-2 px-3 rounded shadow-sm ${isUser ? "bg-success text-white" : "bg-light border"}`}
        style={{ maxWidth: "75%" }}
      >
        {message.content}
      </div>
    </div>
  );
}

export default ChatBubble;
