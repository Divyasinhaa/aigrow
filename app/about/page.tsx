"use client";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center px-6 py-10 transition-colors duration-700">
      <div className="max-w-2xl bg-white/80 dark:bg-gray-800/70 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent text-center mb-4">
            About AI GROW
        </h1>
        <p className="text-sm text-center mb-6">
          AI GROW is your calm, intelligent companion designed to help you learn, reflect, and grow.
          Built using React, Framer Motion, and modern design principles, it brings gentle aesthetics
          together with meaningful conversations.
        </p>

        <div className="space-y-3 text-sm leading-relaxed">
          <p>✨ <strong>Purpose:</strong> Inspire curiosity, mindfulness, and digital literacy.</p>
          <p>🧠 <strong>Features:</strong> Predefined AI insights, real-time conversation, and adaptive themes (light & dark).</p>
          <p>💫 <strong>Built With:</strong> Next.js, Tailwind CSS, Framer Motion — designed for smooth interactions.</p>
          <p>🌗 <strong>Theme:</strong> Toggle between light and dark modes for comfort and focus.</p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition"
          >
            ⬅️ Back to Chat
          </Link>
        </div>
      </div>
    </main>
  );
}
