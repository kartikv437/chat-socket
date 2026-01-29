"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/providers/AuthProvider";

export default function ChatClient({ receiverId }: { receiverId: string }) {
  const { myUserId } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);


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
          status: "delivered",
        },
      ]);
      socket.emit("message-seen", { messageId: msg._id });
    });

    // when other user sees your message
    socket.on("message-seen", ({ messageId }: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, status: "seen" } : m
        )
      );
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
          status:
            msg.senderId === myUserId ? "seen" : undefined,
        }))
      );
    };

    loadMessages();
  }, [receiverId, myUserId]);

  /* ------------------ HELPERS ------------------ */

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) return "Today";

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      // year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Now";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current) return;

    socketRef.current.emit("send-message", {
      receiverId,
      message,
    });

    setMessages(prev => [...prev, { message, self: true }]);
    setMessage("");
  };

  const logOut = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = "/login";
      return;
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b">
        <button>
          <a href="/userData" className="btn btn-primary">
            Back to Users
          </a>
        </button>
        <button className="btn btn-danger" onClick={logOut}>
          Logout
        </button>
      </div>
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
                  {formatDate(m.createdAt)}, {formatTime(m.createdAt)}
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
    </div >


  );
}
