'use client';
import { useState, useEffect, useRef } from 'react';

type Message = { role: 'user' | 'ai'; text: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { category: "Life & Growth", questions: [
      "What are the three most important values in life?",
      "How do I overcome fear of failure?",
      "How can I make learning new skills faster?"
    ]},
    { category: "Technology", questions: [
      "How will AI change jobs in the next decade?",
      "What is quantum computing in simple terms?",
      "How does blockchain work?"
    ]},
    { category: "Future Trends", questions: [
      "What is the future of renewable energy tech?",
      "What’s the fastest way to learn coding?",
      "What are the top 5 emerging technologies in 2025?"
    ]}
  ];

  // Load from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) setMessages(JSON.parse(savedMessages));

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme ?? (prefersDark ? 'dark' : 'light');
    setDarkMode(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const getAIResponse = async (question: string) => {
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);

    // Simulated API call (replace with your real backend)
    setTimeout(() => {
      const fakeAnswer = `🔍 Here's what I found about "${question}":\n\n- Detailed, structured explanation.\n- Examples for clarity.\n- Actionable insights.`;
      setMessages(prev => [...prev, { role: 'ai', text: fakeAnswer }]);
      setLoading(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    getAIResponse(input.trim());
    setInput('');
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="flex justify-between items-center p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI GROW<br/>
          Interactive AI Chatbot Platform
        </h1>
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow hover:opacity-80 transition"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      {/* SUGGESTIONS */}
      <section className="p-4 space-y-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {suggestions.map((group, idx) => (
          <div key={idx}>
            <h2 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">{group.category}</h2>
            <div className="flex flex-wrap gap-2">
              {group.questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => getAIResponse(q)}
                  className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow hover:scale-105 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl p-3 rounded-lg whitespace-pre-line shadow ${
              msg.role === 'user'
                ? 'ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'mr-auto bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg animate-pulse">
            AI is typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-80 transition"
        >
          Send
        </button>
      </div>
    </main>
  );
}
