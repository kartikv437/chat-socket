"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/providers/AuthProvider";

export default function ChatClient({ receiverId }: { receiverId: string }) {
  const { myUserId } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);


  useEffect(() => {
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("receive-message", (msg) => {

      setMessages(prev => [
        ...prev,
        {
          message: msg.message,
          self: msg.senderId === myUserId,
          createdAt: msg.createdAt || new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [myUserId]);

  useEffect(() => {
    const loadMessages = async () => {
      const res = await fetch(
        `/api/message?receiverId=${receiverId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      setMessages(
        data.map((msg: any) => ({
          message: msg.message,
          self: msg.senderId === myUserId,
          createdAt: msg.createdAt,
        }))
      );
    };

    loadMessages();
  }, [receiverId, myUserId]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    
    let nDate= date.toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    return nDate;
  };

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
    <div className="p-4 border rounded-lg shadow-lg max-w-3xl mx-auto mt-10">
      <div className="flex flex-col h-screen p-4">
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
              <div>{m.message}</div>
              <div
                className={`text-[10px] mt-1 text-right ${m.self ? "text-blue-100" : "text-gray-500"
                  }`}
              >
                {formatDateTime(m.createdAt)}
              </div>
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
            disabled={!message}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>

  );
}
