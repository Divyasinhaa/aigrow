"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [animatedText, setAnimatedText] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAskAI = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');
    setAnimatedText('');
    try {
      const res = await axios.post<{ reply: string }>('/api/ask-ai', { prompt: input });
      setResponse(res.data.reply);
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Typing Animation
  useEffect(() => {
    let index = 0;
    if (response) {
      const interval = setInterval(() => {
        setAnimatedText((prev) => prev + response[index]);
        index++;
        if (index >= response.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [response]);

  // Copy Function
  const handleCopy = async () => {
    if (!animatedText) return;
    await navigator.clipboard.writeText(animatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 px-6 py-10 transition">
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-2xl transition">
          {/* Theme Switch */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">Ask Anything</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm text-indigo-600 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500 px-2 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-700 transition"
            >
              {darkMode ? '☀ Light' : '🌙 Dark'}
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none transition bg-white dark:bg-gray-800 dark:text-white"
            rows={4}
            autoFocus
          />
          <button
            onClick={handleAskAI}
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Thinking...</span>
              </div>
            ) : (
              'Get Answer'
            )}
          </button>

          {animatedText && (
            <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">AI Response:</h2>
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
    </div>
  );
}
