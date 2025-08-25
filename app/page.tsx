'use client';
import { useState, useEffect, useRef } from 'react';

type Message = { role: 'user' | 'ai'; text: string };

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🔹 Suggested questions
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

  // 🔹 Predefined answers
  const predefinedAnswers: Record<string, string> = {
    "What are the three most important values in life?":
      " The three most important values often considered are **integrity**, **empathy**, and **growth**. Integrity builds trust, empathy strengthens relationships, and growth ensures progress in life.",
    "How do I overcome fear of failure?":
      " Overcoming fear of failure requires reframing failure as **learning**, breaking goals into **small steps**, and practicing **self-compassion**. Each attempt brings you closer to success.",
    "How can I make learning new skills faster?":
      " Use the **80/20 rule** (focus on the most impactful parts), practice consistently, and apply what you learn immediately. Teaching others also accelerates mastery.",
    "How will AI change jobs in the next decade?":
      " AI will automate repetitive tasks but create new opportunities in **AI oversight, creativity, problem-solving, and human-centered roles**. The future is not jobless—it’s different jobs.",
    "What is quantum computing in simple terms?":
      " Quantum computing uses **qubits**, which can be 0 and 1 at the same time, unlike classical bits. This allows solving complex problems much faster, like drug discovery or encryption breaking.",
    "How does blockchain work?":
      " Blockchain is a **decentralized digital ledger** where transactions are stored in blocks linked together. Once recorded, data is nearly impossible to alter, ensuring security and transparency.",
    "What is the future of renewable energy tech?":
      " Expect massive growth in **solar, wind, and battery storage**. Innovations like **fusion energy** and **smart grids** will push sustainability forward.",
    "What’s the fastest way to learn coding?":
      " Start with **projects**, not just theory. Use free resources, practice daily, and contribute to open-source. Coding is best learned by doing.",
    "What are the top 5 emerging technologies in 2025?":
      " 1. Artificial Intelligence (AI) & Generative AI\n2. Quantum Computing\n3. 6G & Advanced Connectivity\n4. Biotechnology & Gene Editing\n5. Renewable Energy + Green Tech"
  };

  // Load chat + theme
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) setMessages(JSON.parse(savedMessages));

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme ?? (prefersDark ? 'dark' : 'light');
    setDarkMode(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Save chat
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

  // ⏳ Typing effect simulation
  const typeEffect = (text: string) => {
    let index = 0;
    const interval = setInterval(() => {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (!last || last.role !== "ai") return prev;
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          text: last.text + text[index]
        };
        return updated;
      });
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 30); // typing speed (ms per char)
  };

  // 🚀 Get response
  const getResponse = async (question: string) => {
    setMessages(prev => [...prev, { role: 'user', text: question }]);

    // Show "thinking..."
    setLoading(true);
    setMessages(prev => [...prev, { role: "ai", text: "🤔 AI is thinking..." }]);

    setTimeout(async () => {
      let answer = "";

      if (predefinedAnswers[question]) {
        answer = predefinedAnswers[question];
      } else {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: question }),
          });
          const data = await res.json();
          answer = data.answer;
        } catch {
          answer = "⚠️ Failed to fetch AI response.";
        }
      }

      // Replace "thinking..." with typing effect
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "ai", text: "" };
        return updated;
      });
      typeEffect(answer);

      setLoading(false);
    }, 1200); // delay before AI starts "typing"
  };

  const handleSend = () => {
    if (!input.trim()) return;
    getResponse(input.trim());
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
                  onClick={() => getResponse(q)}
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
