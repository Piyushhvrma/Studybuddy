import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { sendMessage } from "../services/api";
import {
  RiSendPlaneLine,
  RiRobot2Line,
  RiMessage3Line,
  RiUserLine,
} from "react-icons/ri";

export default function RoomChat({ roomCode, socket }) {
  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "system",
      text: "Welcome to the study room. Start discussing with your friends.",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserJoined = ({ message }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "_joined",
          type: "system",
          text: message,
          createdAt: new Date().toISOString(),
        },
      ]);
    };

    const handleUserLeft = ({ message }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "_left",
          type: "system",
          text: message,
          createdAt: new Date().toISOString(),
        },
      ]);
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
    };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();

    const text = input.trim();
    if (!text) return;

    const message = {
      id: Date.now() + "_" + user?._id,
      type: "user",
      text,
      sender: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
      },
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", { roomCode, message });
    setInput("");
  };

  const handleAskAI = async () => {
    const question = input.trim();
    if (!question || aiLoading) return;

    const userQuestion = {
      id: Date.now() + "_ai_q",
      type: "user",
      text: `@AI ${question}`,
      sender: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
      },
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", {
      roomCode,
      message: userQuestion,
    });

    setInput("");
    setAiLoading(true);

    try {
      const res = await sendMessage({ question });

      const aiMessage = {
        id: Date.now() + "_ai_ans",
        type: "ai",
        text: res.data.response,
        sender: {
          _id: "momentum-ai",
          name: "Momentum AI",
          email: "ai@momentum.local",
        },
        createdAt: new Date().toISOString(),
      };

      socket.emit("send-message", {
        roomCode,
        message: aiMessage,
      });
    } catch {
      const errorMessage = {
        id: Date.now() + "_ai_error",
        type: "ai",
        text: "AI is not responding right now. Check API configuration.",
        sender: {
          _id: "momentum-ai",
          name: "Momentum AI",
          email: "ai@momentum.local",
        },
        createdAt: new Date().toISOString(),
      };

      socket.emit("send-message", {
        roomCode,
        message: errorMessage,
      });
    } finally {
      setAiLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-surface-border flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold flex items-center gap-2">
            <RiMessage3Line className="text-accent-glow" />
            Room Chat
          </h2>
          <p className="text-white/30 text-xs mt-1">
            Send normal message or ask AI inside room
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-accent-purple/20 flex items-center justify-center">
          <RiRobot2Line className="text-accent-glow" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          if (msg.type === "system") {
            return (
              <div key={msg.id} className="text-center">
                <span className="inline-block text-xs text-white/40 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isAI = msg.type === "ai";
          const isMe = msg.sender?._id === user?._id;

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                    isAI
                      ? "bg-accent-indigo/30 border border-accent-indigo/40"
                      : "bg-gradient-to-br from-accent-purple to-accent-indigo"
                  }`}
                >
                  {isAI ? (
                    <RiRobot2Line />
                  ) : (
                    msg.sender?.name?.charAt(0).toUpperCase() || <RiUserLine />
                  )}
                </div>
              )}

              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                  isAI
                    ? "bg-accent-indigo/20 border border-accent-indigo/30 text-white/80"
                    : isMe
                    ? "bg-accent-purple text-white rounded-br-sm"
                    : "bg-white/5 border border-white/10 text-white/80 rounded-bl-sm"
                }`}
              >
                {!isMe && (
                  <p className="text-xs text-accent-glow font-medium mb-1">
                    {msg.sender?.name || "User"}
                  </p>
                )}

                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.text}
                </p>

                <p
                  className={`text-[10px] mt-1 ${
                    isMe ? "text-white/50" : "text-white/30"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-surface-border flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message or ask AI..."
          className="input-field flex-1"
        />

        <button
          type="button"
          onClick={handleAskAI}
          disabled={aiLoading}
          className="btn-secondary px-4 flex items-center justify-center"
          title="Ask AI in this room"
        >
          {aiLoading ? "..." : <RiRobot2Line />}
        </button>

        <button
          type="submit"
          className="btn-primary px-4 flex items-center justify-center"
        >
          <RiSendPlaneLine />
        </button>
      </form>
    </div>
  );
}