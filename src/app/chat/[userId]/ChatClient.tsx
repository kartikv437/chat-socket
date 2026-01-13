"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function ChatClient({ receiverId }: { receiverId: string }) {
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
      withCredentials: true,
      auth: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTVlMTBhNDY2MWUyNTc0ZDdjMDY0MzIiLCJpYXQiOjE3NjgxOTkxMjIsImV4cCI6MTc2ODI4NTUyMn0.A2LGk-GQ7HxbD8gwzLAh6ZQMX-gO_uWwoypEdK0KeOQ" }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("receive-message", (msg) => {
      console.log(msg);

      setMessages(prev => [
        ...prev,
        {
          message: msg.message,
          self: msg.senderId === msg.receiverId,
        },
      ]);
     });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current) return;

    socketRef.current.emit("send-message", {
      receiverId,
      message,
    });

    setMessages(prev => [...prev, { message, self: true }]);
    setMessage("");
  };

  return (
    <div className="mx-auto mx-w-2xl flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {/* <pre>{JSON.stringify(messages)}</pre> */}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xs p-2 rounded ${m.self
              ? "ml-auto bg-blue-500 text-white"
              : "mr-auto bg-gray-200"
              }`}
          >
            {m.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
