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
      category: 'Life & Growth',
      questions: [
        'What are the three most important values in life?',
        'How do I overcome fear of failure?',
        'How can I make learning new skills faster?',
      ],
    },
    {
      category: 'Technology',
      questions: [
        'How will AI change jobs in the next decade?',
        'What is quantum computing in simple terms?',
        'How does blockchain work?',
      ],
    },
    {
      category: 'AI/ML Concepts',
      questions: [
        'What is AI?',
        'What is ML?',
        'What is the difference between AI and ML?',
      ],
    },
    {
      category: 'Future Trends',
      questions: [
        'What is the future of renewable energy tech?',
        'What’s the fastest way to learn coding?',
        'What are the top 5 emerging technologies in 2025?',
      ],
    },
  ];

  const predefinedAnswers: Record<string, string> = {
    'What are the three most important values in life?':
      '🌱 Honesty, compassion, and perseverance are often seen as core values for a meaningful life.',
    'How do I overcome fear of failure?':
      '💡 Treat failure as feedback. Start small, learn fast, and build confidence step by step.',
    'How can I make learning new skills faster?':
      '⚡ Practice actively, revise with spaced repetition, and build real projects.',
    'What is AI?':
      'AI enables machines to perform tasks that typically require human intelligence.',
    'What is ML?':
      'Machine Learning allows systems to learn patterns from data without explicit programming.',
    'What is the difference between AI and ML?':
      'ML is a subset of AI focused on learning from data.',
    'How will AI change jobs in the next decade?':
      '🤖 AI will automate routine tasks and create new roles in tech, ethics, and innovation.',
    'What is quantum computing in simple terms?':
      '🌀 It uses qubits that can represent multiple states at once, enabling massive parallelism.',
    'How does blockchain work?':
      '⛓️ A decentralized ledger where transactions are stored securely in linked blocks.',
    'What is the future of renewable energy tech?':
      '🌞 Faster solar adoption, better batteries, and green hydrogen breakthroughs.',
    'What’s the fastest way to learn coding?':
      '💻 Build projects, solve problems, and code daily.',
    'What are the top 5 emerging technologies in 2025?':
      '🚀 AI agents, quantum computing, biotech, green energy, and AR/VR.',
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) setMessages(JSON.parse(savedMessages));

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme ?? (prefersDark ? 'dark' : 'light');

    setDarkMode(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

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

  const getAIResponse = (question: string) => {
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setMessages((prev) => [...prev, { role: 'ai', text: '🤔 Thinking...' }]);

    setTimeout(() => {
      const answer =
        predefinedAnswers[question] ??
        `🔍 Here's a structured explanation of "${question}".`;

      setMessages((prev) => [
        ...prev.filter((m) => m.text !== '🤔 Thinking...'),
        { role: 'ai', text: answer },
      ]);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    getAIResponse(input.trim());
    setInput('');
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      <header className="flex justify-between items-center p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          AI GROW <br /> Interactive Chatbot
        </h1>
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      <section className="p-4 space-y-3 bg-white dark:bg-gray-800 border-b">
        {suggestions.map((group, idx) => (
          <div key={idx}>
            <h2 className="font-semibold text-sm mb-2">{group.category}</h2>
            <div className="flex flex-wrap gap-2">
              {group.questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => getAIResponse(q)}
                  className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl p-3 rounded-lg ${
              msg.role === 'user'
                ? 'ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'mr-auto bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t bg-white dark:bg-gray-900 flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        >
          Send
        </button>
      </div>
    </main>
  );
}
