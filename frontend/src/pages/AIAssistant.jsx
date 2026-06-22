import { useEffect, useRef, useState } from "react";
import { sendMessage, getChatHistory, clearChatHistory } from "../services/api";
import {
  RiRobot2Line,
  RiSendPlaneLine,
  RiDeleteBin2Line,
  RiUserLine,
  RiFlashlightLine,
  RiLoader4Line,
} from "react-icons/ri";

const SUGGESTIONS = [
  "Explain Binary Search with examples",
  "Generate OOPS Interview Questions",
  "Explain DBMS Normalization",
  "Create a 30-day DSA study plan",
  "Summarize OS scheduling algorithms",
  "Explain TCP/IP in simple terms",
  "Generate questions on React hooks",
  "Explain Big O Notation",
];

const formatResponse = (text) => {
  // Simple markdown-like rendering
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(
      /`(.*?)`/g,
      '<code class="bg-white/10 text-accent-glow px-1 rounded font-mono text-sm">$1</code>',
    )
    .replace(
      /^#{1,3} (.*$)/gm,
      '<h3 class="text-white font-semibold text-base mt-3 mb-1">$1</h3>',
    )
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-white/70">$1</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
};

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getChatHistory();
        const history = res.data.history
          .reverse()
          .map((h) => [
            { role: "user", text: h.question, id: h._id + "_q" },
            { role: "ai", text: h.response, id: h._id + "_r" },
          ])
          .flat();
        setMessages(history);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (question) => {
    const q = question || input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q, id: Date.now() }]);
    setLoading(true);

    try {
      const res = await sendMessage({ question: q });
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.data.response, id: Date.now() + 1 },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I couldn't process that. Please check your Gemini API key configuration.",
          id: Date.now() + 1,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = async () => {
    if (!confirm("Clear all chat history?")) return;
    await clearChatHistory();
    setMessages([]);
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 flex flex-col animate-fade-in"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center shadow-glow">
            <RiRobot2Line className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Assistant</h1>
            <p className="text-white/40 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow inline-block" />
              Powered by Gemini
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="btn-danger flex items-center gap-2 text-sm py-2"
          >
            <RiDeleteBin2Line /> Clear
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto glass-card p-4 space-y-4 mb-4">
        {historyLoading ? (
          <div className="flex items-center justify-center h-full">
            <RiLoader4Line className="text-3xl text-accent-purple animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center mb-4 shadow-glow">
              <RiFlashlightLine className="text-white text-2xl" />
            </div>
            <h2 className="text-white font-semibold text-lg mb-1">
              StudyBuddy Assistant
            </h2>
            <p className="text-white/40 text-sm mb-8 text-center max-w-sm">
              Ask me anything about DSA, DBMS, OS, interview questions, study
              plans, and more.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs text-white/60 hover:text-white bg-surface-hover hover:bg-accent-purple/10 border border-surface-border hover:border-accent-purple/30 rounded-lg px-3 py-2.5 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 animate-slide-up ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-accent-purple/30" : "bg-gradient-to-br from-accent-purple to-accent-indigo"}`}
                >
                  {msg.role === "user" ? (
                    <RiUserLine className="text-accent-glow text-sm" />
                  ) : (
                    <RiRobot2Line className="text-white text-sm" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-accent-purple/20 border border-accent-purple/30 text-white"
                      : msg.isError
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-surface-hover border border-surface-border text-white/80"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatResponse(msg.text),
                      }}
                    />
                  ) : (
                    <p className="text-sm">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center shrink-0">
                  <RiRobot2Line className="text-white text-sm" />
                </div>
                <div className="bg-surface-hover border border-surface-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-accent-purple rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="glass-card p-3 flex items-center gap-3 shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask anything — DSA, interview prep, study plans..."
          className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl bg-accent-purple hover:bg-accent-violet disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:shadow-glow"
        >
          {loading ? (
            <RiLoader4Line className="text-white animate-spin" />
          ) : (
            <RiSendPlaneLine className="text-white" />
          )}
        </button>
      </div>

      {/* Quick suggestions when chat is active */}
      {messages.length > 0 && !loading && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 shrink-0">
          {SUGGESTIONS.slice(0, 4).map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="text-xs text-white/40 hover:text-white whitespace-nowrap bg-surface-hover hover:bg-accent-purple/10 border border-surface-border hover:border-accent-purple/30 rounded-full px-3 py-1.5 transition-all shrink-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
