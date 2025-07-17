'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [feature, setFeature] = useState('ask');
  const [output, setOutput] = useState('');
  const [animatedText, setAnimatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  const mockAIResponse = (text: string, feature: string): string => {
    const lowerText = text.toLowerCase();

    // 🌐 Technology Cases
    if (lowerText.includes('artificial intelligence') || lowerText.includes('ai')) {
      return `🤖 Artificial Intelligence:\nAI simulates human intelligence using algorithms and data. Applications include chatbots, self-driving cars, and medical diagnosis.`;
    }

    if (lowerText.includes('blockchain') || lowerText.includes('cryptocurrency')) {
      return `🔗 Blockchain & Crypto:\nBlockchain is a secure digital ledger used in cryptocurrencies like Bitcoin. It's also useful in identity management and smart contracts.`;
    }

    if (lowerText.includes('cybersecurity') || lowerText.includes('hacking') || lowerText.includes('data breach')) {
      return `🛡 Cybersecurity:\nIt protects data and systems from malicious attacks. Essential practices include encryption, firewalls, and ethical hacking.`;
    }

    if (lowerText.includes('web development') || lowerText.includes('frontend') || lowerText.includes('backend')) {
      return `🌐 Web Development:\nFrontend (React, HTML, CSS) and backend (Node, databases) work together to build modern websites.`;
    }

    if (lowerText.includes('programming') || lowerText.includes('developer')) {
      return `👨‍💻 Programming:\nWriting instructions in languages like Python, JavaScript, C++. Helps solve problems and build digital systems.`;
    }

    if (lowerText.includes('cloud') || lowerText.includes('aws') || lowerText.includes('azure')) {
      return `☁️ Cloud Computing:\nAWS, Azure, GCP let you host applications on remote servers. Scalable and cost-effective.`;
    }

    if (lowerText.includes('iot') || lowerText.includes('internet of things')) {
      return `📡 Internet of Things (IoT):\nConnects devices like lights, sensors, fridges to the internet. Enables automation and monitoring.`;
    }

    if (lowerText.includes('quantum computing') || lowerText.includes('qubit')) {
      return `⚛️ Quantum Computing:\nUses qubits to perform computations far beyond classical computers. Still experimental, with huge potential.`;
    }

    if (lowerText.includes('vr') || lowerText.includes('ar')) {
      return `🕶️ Virtual & Augmented Reality:\nVR creates digital worlds, AR adds virtual elements to real ones. Used in gaming, training, and design.`;
    }

    if (lowerText.includes('web3') || lowerText.includes('decentralized')) {
      return `🌐 Web3:\nThe decentralized web powered by blockchain. You own your data and identity.`;
    }

    // 🧠 Feature Logic
    switch (feature) {
      case 'ask':
        return `🤖 Here's a helpful response:\n\n"${text}"\n\nYou asked something deep. Consider exploring related resources for better clarity.`;

      case 'summarize':
        return `📝 Summary:\n${text.split(' ').slice(0, 12).join(' ')}...`;

      case 'sentiment':
        if (lowerText.includes('bad') || lowerText.includes('hate') || lowerText.includes('sad')) {
          return '😞 Negative sentiment detected. Hope things improve soon.';
        } else if (lowerText.includes('good') || lowerText.includes('happy') || lowerText.includes('love')) {
          return '😊 Positive sentiment detected. Stay joyful!';
        } else {
          return '😐 Neutral tone detected. Clear and calm.';
        }

      case 'joke':
        const jokes = [
          '😂 Why don’t scientists trust atoms? Because they make up everything!',
          '🤣 Why did the math book look sad? It had too many problems.',
          '😅 My computer needed a break, now it only shows beach wallpapers.',
          '😆 Parallel lines have so much in common… they never meet.',
          '🧠 AI joke: I’d tell you a deep learning joke, but you might not get it without enough data.',
          '💾 Programmer joke: I changed my password to "incorrect". So now it reminds me when I forget.'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];

      default:
        return '🤷 Unknown feature. Try another one.';
    }
  };

  const handleGenerate = async () => {
    if (!input && feature !== 'joke') return;
    setLoading(true);
    setOutput('');
    setAnimatedText('');

    setTimeout(() => {
      const result = mockAIResponse(input, feature);
      setOutput(result);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    let i = 0;
    if (output) {
      const interval = setInterval(() => {
        setAnimatedText((prev) => prev + output[i]);
        i++;
        if (i >= output.length) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [output]);

  const handleCopy = async () => {
    if (!animatedText) return;
    await navigator.clipboard.writeText(animatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 py-10 transition">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-300">
            Simple AI Playground
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm border border-indigo-400 dark:border-indigo-600 px-3 py-1 rounded-md text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition"
          >
            {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Feature Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose a Feature:</label>
          <select
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            className="w-full p-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
          >
            <option value="ask">Ask a Question</option>
            <option value="summarize">Summarize Text</option>
            <option value="sentiment">Sentiment Analysis</option>
            <option value="joke">Tell me a Joke</option>
          </select>
        </div>

        {/* Input Area */}
        {feature !== 'joke' && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enter Text:</label>
            <textarea
              rows={4}
              className="w-full p-3 border rounded-md resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
              placeholder="Type something here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Thinking...</span>
            </div>
          ) : (
            'Generate Response'
          )}
        </button>

        {/* Output */}
        {animatedText && (
          <div className="border-t pt-4 border-gray-300 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">AI Output:</h2>
              <button
                onClick={handleCopy}
                className="text-sm text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{animatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
