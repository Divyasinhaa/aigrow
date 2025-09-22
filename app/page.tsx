'use client';
import { useState, useEffect, useRef } from 'react';

type Message = { role: 'user' | 'ai'; text: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    {
      category: "Life & Growth",
      questions: [
        "What are the three most important values in life?",
        "How do I overcome fear of failure?",
        "How can I make learning new skills faster?"
      ]
    },
    {
      category: "Technology",
      questions: [
        "How will AI change jobs in the next decade?",
        "What is quantum computing in simple terms?",
        "How does blockchain work?"
      ]
    },
    {
      category: "AI/ML Concepts",
      questions: [
        "What is AI?",
        "What is ML?",
        "What is the difference between AI and ML?"
      ]
    },
    {
      category: "Future Trends",
      questions: [
        "What is the future of renewable energy tech?",
        "What’s the fastest way to learn coding?",
        "What are the top 5 emerging technologies in 2025?"
      ]
    }
  ];

  // Load chat history + theme
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) setMessages(JSON.parse(savedMessages));

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme ?? (prefersDark ? 'dark' : 'light');
    setDarkMode(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Save chat history
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

  // 🔹 AI Response with "thinking dots"
  const getAIResponse = async (question: string) => {
    setMessages(prev => [...prev, { role: "user", text: question }]);

    // Show AI thinking placeholder
    let thinkingMsg = { role: "ai", text: "🤔 Thinking" };
    setMessages(prev => [...prev, thinkingMsg]);

    // Animate dots
    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      thinkingMsg.text = "🤔 Thinking" + ".".repeat(dotCount);
      setMessages(prev => [...prev.filter(m => m !== thinkingMsg), { ...thinkingMsg }]);
    }, 500);

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      clearInterval(interval); // stop thinking dots
      setMessages(prev => [
        ...prev.filter(m => m !== thinkingMsg),
        { role: "ai", text: data.answer },
      ]);
    } catch (error) {
      clearInterval(interval);
      setMessages(prev => [
        ...prev.filter(m => m !== thinkingMsg),
        { role: "ai", text: "⚠️ Error: could not connect to backend." },
      ]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    getAIResponse(input.trim());
    setInput('');
  };

  return (
    <main className="min-h-screen flex flex-col 
      bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 
      dark:from-gray-950 dark:via-gray-900 dark:to-black 
      text-gray-900 dark:text-gray-100 transition-colors duration-500 font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-center p-4 
        bg-gradient-to-r from-indigo-500 to-purple-600 
        dark:from-gray-800 dark:to-gray-900 
        text-white shadow-lg sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold tracking-wide">
          🌸 AI GROW <br/> <span className="text-sm">Interactive Chatbot</span>
        </h1>
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded-lg bg-white/20 text-white shadow hover:bg-white/30 transition"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      {/* SUGGESTIONS */}
      <section className="p-4 space-y-3 bg-white/60 dark:bg-gray-800/70 border-b border-gray-300 dark:border-gray-700">
        {suggestions.map((group, idx) => (
          <div key={idx}>
            <h2 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">{group.category}</h2>
            <div className="flex flex-wrap gap-2">
              {group.questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => getAIResponse(q)}
                  className="px-3 py-1 text-sm rounded-full 
                    bg-gradient-to-r from-indigo-400 to-pink-400 
                    text-white shadow-md hover:scale-105 transition"
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
            className={`max-w-xl p-3 rounded-xl shadow-md text-sm whitespace-pre-line leading-relaxed ${
              msg.role === 'user'
                ? 'ml-auto bg-gradient-to-r from-indigo-500 to-pink-500 text-white'
                : 'mr-auto bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 
        bg-white/70 dark:bg-gray-900/80 flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-400 dark:border-gray-600 
            dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 outline-none transition"
          placeholder="💬 Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 
            text-white font-medium shadow-md hover:opacity-90 transition"
        >
          Send
        </button>
      </div>
    </main>
  );
}
