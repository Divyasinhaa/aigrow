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

  const mockAIResponse = (text: string, feature: string): string => {
  const lowerText = text.toLowerCase();

  // 💻 Technology-Specific Responses
  if (lowerText.includes('artificial intelligence') || lowerText.includes('ai')) {
    return `🤖 Artificial Intelligence:\nAI is the simulation of human intelligence by machines. It includes machine learning, natural language processing, computer vision, and more. AI is transforming industries from healthcare to finance to education.`;
  }

  if (lowerText.includes('blockchain') || lowerText.includes('cryptocurrency')) {
    return `🔗 Blockchain & Crypto:\nBlockchain is a distributed ledger technology enabling secure, decentralized transactions. It's the backbone of cryptocurrencies like Bitcoin and Ethereum, and it has potential beyond finance — in supply chains, voting systems, and identity verification.`;
  }

  if (lowerText.includes('cybersecurity') || lowerText.includes('hacking') || lowerText.includes('data breach')) {
    return `🛡 Cybersecurity:\nCybersecurity involves protecting systems, networks, and data from digital attacks. Common threats include malware, phishing, and ransomware. Always use strong passwords, enable 2FA, and keep software updated.`;
  }

  if (lowerText.includes('web development') || lowerText.includes('frontend') || lowerText.includes('backend')) {
    return `🌐 Web Development:\nWeb development includes frontend (HTML, CSS, JS, React) and backend (Node.js, Python, databases). Full-stack developers handle both sides. Responsive design and performance optimization are key in modern web apps.`;
  }

  if (lowerText.includes('programming') || lowerText.includes('coding') || lowerText.includes('developer')) {
    return `👨‍💻 Programming:\nProgramming is the process of writing instructions for computers. Popular languages include Python, JavaScript, C++, and Java. Learning to code builds logical thinking and problem-solving skills.`;
  }

  if (lowerText.includes('cloud computing') || lowerText.includes('aws') || lowerText.includes('azure')) {
    return `☁️ Cloud Computing:\nCloud platforms like AWS, Azure, and GCP provide scalable resources over the internet. You can host websites, run servers, store databases, and more — all without managing physical hardware.`;
  }

  // Keep the general feature-based logic
  switch (feature) {
    case 'ask':
      return `🤖 Here's a helpful response to your question:\n\n"${text}"\n\nThis is a complex and interesting topic! Consider researching more using reliable sources and asking follow-up questions for deeper insight.`;

    case 'summarize':
      return `📝 Summary:\n${text.split(' ').slice(0, 12).join(' ')}... \n\nThis summary highlights the beginning of your text. Advanced summarization would prioritize key ideas and intent.`;

    case 'sentiment':
      if (lowerText.includes('bad') || lowerText.includes('hate') || lowerText.includes('sad') || lowerText.includes('angry')) {
        return '😞 Sentiment Analysis:\nYour message seems to express a negative emotion. Stay strong. Better moments are always ahead.';
      } else if (lowerText.includes('good') || lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('love')) {
        return '😊 Sentiment Analysis:\nPositive vibes detected! Keep sharing the good energy.';
      } else {
        return '😐 Sentiment Analysis:\nNeutral tone observed. Clear, calm, and composed.';
      }

    case 'joke':
      const jokes = [
        '😂 Why don’t scientists trust atoms? Because they make up everything!',
        '🤣 Why did the math book look sad? Because it had too many problems.',
        '😅 I told my computer I needed a break, and now it won’t stop sending me beach wallpapers.',
        '😆 Parallel lines have so much in common… it’s a shame they’ll never meet.',
        '🧠 AI joke: I would tell you a machine learning joke... but you might not get it without enough training data.',
        '💾 Programmer joke: I changed my password to "incorrect" so whenever I forget it, the computer reminds me, “Your password is incorrect.”'
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];

    default:
      return '🤷 Unknown feature selected. Try a different option or rephrase your input.';
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
  <div>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 py-10 transition">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 transition-all duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-300">
            Simple AI Playground
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm border border-indigo-300 dark:border-indigo-600 px-3 py-1 rounded-md text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition"
          >
            {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Feature Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Choose a Feature:
          </label>
          <select
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            className="w-full p-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter Text:
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border rounded-md resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                AI Output:
              </h2>
              <button
                onClick={handleCopy}
                className="text-sm text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {animatedText}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

}
