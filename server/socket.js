import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Message from "../src/models/Message.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import fs from "fs";
import { parse } from "cookie";

const url = process.env.MONGODB_URL;
if (!url) {
  throw new Error('MONGODB_URL is not defined');
}
mongoose.connect(url);

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    console.log('cookie:', cookieHeader);

    if (!cookieHeader) return next(new Error("No cookies found"));
    const cookies = parse(cookieHeader);
    const token = cookies.token;
    if (!token) return next(new Error("No token found"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.join(socket.userId); // 🔥 IMPORTANT

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("send-message", async ({ receiverId, message }) => {
    if (!message) return;
    const saved = await Message.create({
      senderId: socket.userId,
      receiverId,
      message,
    });
    // Send to receiver
    io.to(receiverId).emit("receive-message", {
      message: saved.message,
      senderId: socket.userId,
    });

    // Send back to sender (sync UI)
    // socket.emit("receive-message", saved);
  });
});

httpServer.listen(4000, () => {
  console.log("🚀 Socket server running on http://localhost:4000");
});


