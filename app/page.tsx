"use client";
import { useState, useEffect } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    // Thinking placeholder
    const thinkingMsg: Message = { role: "ai", text: "🤔 Thinking" };
    setMessages((prev) => [...prev, thinkingMsg]);

    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setMessages((prev) =>
        prev.map((m, idx) =>
          idx === prev.length - 1
            ? { ...m, text: "🤔 Thinking" + ".".repeat(dotCount) }
            : m
        )
      );
    }, 500);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      clearInterval(interval);

      // Replace thinking with real AI response
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", text: data.reply },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="p-4 bg-indigo-600 text-white font-bold text-lg shadow-md">
        🤖 AI Grow
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[75%] ${
              msg.role === "user"
                ? "ml-auto bg-indigo-500 text-white"
                : "mr-auto bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </main>

      {/* Input Bar (always visible) */}
      <footer className="p-4 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 sticky bottom-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </footer>
    </div>
  );
}
