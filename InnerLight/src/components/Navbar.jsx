import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MessageSquare, User, LogOut, Users } from "lucide-react";
import ChatPopup from "./ChatPopup";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);

  // Dummy data - replace with your actual data source
  const [notifications, setNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const handleClick = (type) => {
    setShowChat(type === "chat" ? !showChat : false);
    setShowNotifications(type === "notifications" ? !showNotifications : false);
    setShowFriendRequests(type === "friends" ? !showFriendRequests : false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <h2
        className="text-xl font-bold text-success cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        InnerLight 🌱
      </h2>

      <div className="flex items-center gap-4">
        {/* Friend Requests */}
        <button className="relative" onClick={() => handleClick("friends")}>
          <Users size={22} className="text-gray-700" />
          {friendRequests.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {friendRequests.length}
            </span>
          )}
        </button>

        {/* Notifications */}
        <button className="relative" onClick={() => handleClick("notifications")}>
          <Bell size={22} className="text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Chat */}
        <button className="relative" onClick={() => handleClick("chat")}>
          <MessageSquare size={22} className="text-gray-700" />
          {chatMessages.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {chatMessages.length}
            </span>
          )}
        </button>

        {/* 👤 Profile */}
        <button
          title="Profile"
          onClick={handleProfileClick}
          className="text-gray-700 hover:text-gray-900"
        >
          <User size={22} />
        </button>

        {/* 🔴 Logout */}
        <button 
          onClick={onLogout} 
          title="Logout"
          className="text-red-500 hover:text-red-600"
        >
          <LogOut size={22} />
        </button>
      </div>

      {/* Dropdowns - These will appear but won't have real-time updates */}
      {showChat && (
        <ChatPopup 
          messages={chatMessages} 
          onClose={() => setShowChat(false)} 
        />
      )}

      {showNotifications && (
        <div className="absolute right-4 top-16 bg-white shadow-lg rounded-md p-4 w-64">
          <h3 className="font-semibold border-b pb-2">Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((n, i) => (
              <p key={i} className="text-sm text-gray-600 py-2 border-b">
                {n.message || "Sample notification"}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500 py-2">No new notifications.</p>
          )}
        </div>
      )}

      {showFriendRequests && (
        <div className="absolute right-20 top-16 bg-white shadow-lg rounded-md p-4 w-64">
          <h3 className="font-semibold border-b pb-2">Friend Requests</h3>
          {friendRequests.length > 0 ? (
            friendRequests.map((r, i) => (
              <p key={i} className="text-sm text-gray-600 py-2 border-b">
                {r.from || "Sample user"} sent you a request.
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500 py-2">No pending requests.</p>
          )}
        </div>
      )}
    </nav>
  );
}