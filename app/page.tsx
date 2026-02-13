'use client';

import { useState, useEffect, useRef } from 'react';

type Message = { 
  role: 'user' | 'ai'; 
  text: string;
  timestamp: Date;
  id: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    {
      category: '🌱 Life & Personal Growth',
      icon: '🌟',
      questions: [
        'What are the three most important values in life?',
        'How do I overcome fear of failure?',
        'How can I make learning new skills faster?',
        'What daily habits lead to success?',
      ],
    },
    {
      category: '💻 Technology & Innovation',
      icon: '🚀',
      questions: [
        'How will AI change jobs in the next decade?',
        'What is quantum computing in simple terms?',
        'How does blockchain work?',
        'What are neural networks?',
      ],
    },
    {
      category: '🤖 AI & Machine Learning',
      icon: '🧠',
      questions: [
        'What is AI?',
        'What is ML?',
        'What is the difference between AI and ML?',
        'How does deep learning work?',
      ],
    },
    {
      category: '🔮 Future Trends',
      icon: '⚡',
      questions: [
        'What is the future of renewable energy tech?',
        'What is the fastest way to learn coding?',
        'What are the top 5 emerging technologies in 2025?',
        'How will the metaverse evolve?',
      ],
    },
  ];

  const predefinedAnswers: Record<string, string> = {
    'What are the three most important values in life?':
      '🌱 Honesty, Compassion, and Perseverance are often considered foundational values.\n\n• Honesty builds trust and authentic relationships\n• Compassion creates meaningful connections and positive impact\n• Perseverance helps you overcome obstacles and achieve long-term goals\n\nThese values work together to create a fulfilling and purposeful life.',
    
    'How do I overcome fear of failure?':
      '💡 Reframe Your Mindset:\n\n1. See failure as feedback - Every setback is a learning opportunity\n2. Start small - Break big goals into manageable steps\n3. Celebrate progress - Acknowledge small wins along the way\n4. Visualize success - But prepare for challenges\n5. Build a support network - Surround yourself with encouragement\n\nRemember: Every successful person has failed multiple times. It is part of the journey!',
    
    'How can I make learning new skills faster?':
      '⚡ Accelerated Learning Strategies:\n\n✓ Active Practice - Do, do not just read\n✓ Spaced Repetition - Review material at increasing intervals\n✓ Build Real Projects - Apply knowledge immediately\n✓ Teach Others - Explaining solidifies understanding\n✓ Focus on Fundamentals - Master the basics first\n✓ Get Feedback - Learn from mistakes quickly\n\nThe key is deliberate practice combined with consistent effort!',
    
    'What daily habits lead to success?':
      '🎯 Top Success Habits:\n\n• Wake up early and plan your day\n• Exercise for mental and physical energy\n• Read for 30 minutes daily\n• Practice gratitude and reflection\n• Set clear, achievable goals\n• Prioritize deep work over busywork\n• Build meaningful relationships\n\nConsistency beats intensity every time!',
    
    'What is AI?':
      '🤖 Artificial Intelligence (AI) is the simulation of human intelligence by machines.\n\nKey capabilities:\n• Learning from experience\n• Understanding language\n• Recognizing patterns\n• Making decisions\n• Solving complex problems\n\nAI powers everything from voice assistants to self-driving cars!',
    
    'What is ML?':
      '📊 Machine Learning (ML) is a subset of AI where systems learn from data without explicit programming.\n\nHow it works:\n1. Feed data to the algorithm\n2. Algorithm finds patterns\n3. Model makes predictions\n4. Improves with more data\n\nThink of it as teaching computers to learn like humans do!',
    
    'What is the difference between AI and ML?':
      '🎯 AI vs ML:\n\nAI (Artificial Intelligence)\n• Broader concept\n• Simulates human intelligence\n• Includes ML, robotics, NLP, etc.\n\nML (Machine Learning)\n• Subset of AI\n• Focuses on learning from data\n• Powers most modern AI applications\n\nAnalogy: AI is the destination, ML is one of the vehicles to get there!',
    
    'How does deep learning work?':
      '🧠 Deep Learning uses artificial neural networks with multiple layers.\n\nProcess:\n1. Input data → First layer\n2. Each layer extracts features\n3. Deeper layers learn complex patterns\n4. Output layer makes predictions\n\nIt is inspired by how our brain processes information!',
    
    'How will AI change jobs in the next decade?':
      '🤖 AI Impact on Jobs:\n\nWill Automate:\n• Routine, repetitive tasks\n• Data entry and processing\n• Basic customer service\n\nWill Create:\n• AI trainers and ethicists\n• Prompt engineers\n• Human-AI collaboration roles\n• Creative and strategic positions\n\nKey: Adapt and upskill continuously!',
    
    'What is quantum computing in simple terms?':
      '🌀 Quantum Computing leverages quantum mechanics for computation.\n\nRegular Computers:\nBits = 0 or 1\n\nQuantum Computers:\nQubits = 0, 1, or BOTH simultaneously!\n\nThis superposition enables:\n• Massive parallel processing\n• Solving complex problems faster\n• Breaking current encryption\n\nWe are still in early stages, but the potential is enormous!',
    
    'How does blockchain work?':
      '⛓️ Blockchain Explained:\n\n1. Transaction occurs → New data created\n2. Block formed → Data packaged with others\n3. Verification → Network validates the block\n4. Chaining → Block added to chain permanently\n5. Distribution → Entire network receives update\n\nKey Features:\n• Decentralized (no single authority)\n• Transparent and immutable\n• Secure through cryptography\n\nThink of it as a digital ledger everyone can see but no one can change!',
    
    'What are neural networks?':
      '🕸️ Neural Networks are computing systems inspired by biological brains.\n\nStructure:\n• Input Layer → Receives data\n• Hidden Layers → Process information\n• Output Layer → Produces results\n\nApplications:\n• Image recognition\n• Language translation\n• Voice assistants\n• Medical diagnosis\n\nThey are the backbone of modern AI!',
    
    'What is the future of renewable energy tech?':
      '🌞 Renewable Energy Future:\n\nSolar:\n• Perovskite cells (more efficient)\n• Solar paint and windows\n• Space-based solar power\n\nStorage:\n• Advanced batteries\n• Green hydrogen\n• Gravity-based storage\n\nSmart Grids:\n• AI-optimized distribution\n• Decentralized energy networks\n\nThe future is clean, distributed, and intelligent!',
    
    'What is the fastest way to learn coding?':
      '💻 Fast-Track Coding:\n\n1. Pick one language (Python recommended)\n2. Build projects immediately - Learn by doing\n3. Code daily - Even 30 minutes counts\n4. Use interactive platforms - freeCodeCamp, Codecademy\n5. Join communities - GitHub, Stack Overflow\n6. Debug everything - Mistakes teach the most\n\nPro tip: Clone projects you admire, then customize them!',
    
    'What are the top 5 emerging technologies in 2025?':
      '🚀 Top 5 Emerging Technologies:\n\n1. AI Agents - Autonomous systems that act on your behalf\n2. Quantum Computing - Next-gen processing power\n3. Biotech - CRISPR, synthetic biology, longevity research\n4. Green Energy - Fusion, advanced solar, green hydrogen\n5. AR/VR - Spatial computing and the metaverse\n\nBonus: Brain-computer interfaces are rapidly advancing!\n\nThe 2020s will be remembered as a decade of exponential change!',
    
    'How will the metaverse evolve?':
      '🌐 Metaverse Evolution:\n\nShort-term (2025-2027):\n• Better VR/AR hardware\n• Virtual workspaces\n• Digital fashion and assets\n\nLong-term (2028+):\n• Seamless virtual-physical integration\n• Haptic feedback systems\n• Digital economies and governance\n\nWe are moving from isolated virtual worlds to a connected metaverse!',
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    const savedName = localStorage.getItem('userName');
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
    
    if (savedName) {
      setUserName(savedName);
      setShowWelcome(false);
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme ?? (prefersDark ? 'dark' : 'light');

    setDarkMode(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const clearHistory = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([]);
      localStorage.removeItem('chatHistory');
    }
  };

  const setName = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    setShowWelcome(false);
    inputRef.current?.focus();
  };

  const getAIResponse = (question: string) => {
    const userMessage: Message = {
      role: 'user',
      text: question,
      timestamp: new Date(),
      id: Date.now().toString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const answer =
        predefinedAnswers[question] ??
        `🔍 Great question! Let me provide a structured explanation of "${question}".\n\nThis is a complex topic that involves multiple aspects. I would recommend exploring it further through:\n• Research and reading\n• Hands-on practice\n• Discussion with experts\n\nWould you like me to break down a specific aspect of this topic?`;

      const aiMessage: Message = {
        role: 'ai',
        text: answer,
        timestamp: new Date(),
        id: (Date.now() + 1).toString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    getAIResponse(input.trim());
    setInput('');
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">🤖</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome to AI GROW
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your personal AI assistant for learning and growth
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What should I call you?
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      setName(e.currentTarget.value.trim());
                    }
                  }}
                  autoFocus
                />
              </div>

              <button
                onClick={(e) => {
                  const parentDiv = e.currentTarget.previousElementSibling as HTMLElement;
                  const input = parentDiv?.querySelector('input') as HTMLInputElement;
                  if (input?.value.trim()) {
                    setName(input.value.trim());
                  }
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Start Chatting
              </button>

              <button
                onClick={() => setShowWelcome(false)}
                className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI GROW
          </h1>
          {userName && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Welcome back, {userName}! 👋
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={clearHistory}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
            title="Clear chat history"
          >
            🗑️
          </button>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Suggestions */}
      {messages.length === 0 && (
        <section className="p-6 space-y-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              What would you like to explore today?
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {suggestions.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">{group.icon}</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {group.category.replace(/^[^\s]+ /, '')}
                    </span>
                  </h3>
                  <div className="flex flex-col gap-2">
                    {group.questions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => getAIResponse(q)}
                        className="px-4 py-2.5 text-sm text-left rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500 hover:to-purple-600 hover:text-white border border-blue-200 dark:border-purple-800 hover:border-transparent transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {formatMessage(msg.text)}
                </div>
                <div
                  className={`text-[10px] mt-2 ${
                    msg.role === 'user'
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-500'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500"
            placeholder={userName ? `Ask me anything, ${userName}...` : "Ask me anything..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Send ✨
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-2">
          Powered by AI GROW • Your intelligent learning companion
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
