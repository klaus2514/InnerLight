const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // ✅ Needed for Socket.IO
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const moodRoutes = require("./routes/moodRoutes");
const journalRoutes = require("./routes/journalRoutes");
const selfHelpRoutes = require("./routes/selfHelpRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const forumRoutes = require("./routes/forumRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const aiRoutes = require("./routes/aiRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ✅ wrap app with HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  },
});

// ✅ Global Socket.IO event handling
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("sendNotification", (data) => {
    io.emit("receiveNotification", data); // broadcast to all
  });

  socket.on("sendFriendRequest", (data) => {
    io.emit("receiveFriendRequest", data);
  });

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

// Optional: store io globally for other controllers
app.set("io", io);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/selfhelp", selfHelpRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", require("./routes/forumRoutes"));


app.get("/", (req, res) => {
  res.send("InnerLight API is running 🌿");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
