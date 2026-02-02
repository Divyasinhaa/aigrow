"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Message = { role: "user" | "ai"; text: string; meta?: { source?: string } };

export default function Home() {
  const CONFIG = {
    title: "AIGROW",
    subtitle: "Your Personal Visa & Immigration Companion",
    accentGradient: "from-blue-500 via-purple-500 to-indigo-600",
    themeKey: "visa-assist-theme",
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text:
        "👋 Hi! I'm AIGROW — your friendly visa advisor. Ask me anything about visas (documents, processing time, fees, appointments, rejections, country-specific rules).",
      meta: { source: "system" },
    },
  ]);

  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading] = useState(false);

  // ---------------------------------------
  // 🔥 PREDEFINED QUESTIONS & ANSWERS HERE
  // ---------------------------------------
  const preAnswers: Record<string, string> = {
    "student visa documents":
      "📘 **Student Visa Documents**\n\nHere’s what you typically need:\n- Valid passport\n- Offer letter / I-20 / CAS\n- Proof of funds\n- Academic transcripts\n- Visa application form\n- Passport-size photos\n- English test score (IELTS/TOEFL)\n\nNeed country-specific requirements? Just tell me!",
    
    "tourist visa documents":
      "🧳 **Tourist Visa Documents**\n\nUsually required:\n- Valid passport\n- Return flight tickets\n- Hotel booking or invitation letter\n- Bank statement (3–6 months)\n- Travel itinerary\n- Employment ID or student ID\n\nAsk for any country and I'll give exact requirements.",

    "work visa documents":
      "💼 **Work Visa Documents**\n\nMost countries require:\n- Passport\n- Job offer letter\n- Employer sponsorship form\n- Educational certificates\n- Experience letters\n- Medical test report\n\nWant the list for a specific country?",

    "visa rejection":
      "⚠️ **Common Visa Rejection Reasons**:\n- Insufficient funds\n- Incomplete documents\n- Strong doubt of intent\n- Wrong visa category\n- Fake documents\n\nTell me the country & reason — I'll help you prepare better for re-apply.",

    "processing time":
      "⏳ **Visa Processing Time**\n\nMost embassies take:\n- Tourist visa: 5–20 days\n- Student visa: 3–6 weeks\n- Work visa: 1–3 months\n\nEvery country is different — ask me the country and visa type!",

    "visa appointment":
      "📅 **Booking a Visa Appointment**\n\nGeneral steps:\n1. Create an account on the embassy portal.\n2. Fill visa form.\n3. Pay fee.\n4. Choose an appointment slot.\n5. Attend biometrics/interview.\n\nTell me the country — I’ll send the exact link!",

    "visa interview":
      "🎤 **Visa Interview Tips**:\n- Be confident & honest\n- Know your purpose clearly\n- Show strong financial ties\n- Bring all documents well-organized\n- Give short, clear answers\n\nIf you want, I can give common interview questions too!",

    "financial proof":
      "💰 **Financial Proof Requirements**:\n- Bank statement (3–6 months)\n- Income tax returns\n- Salary slips\n- Sponsorship letter (if applicable)\n- Fixed deposits / assets\n\nTell me country & visa type — amounts differ!",

    default:
      "🙂 I'm not fully sure about that. Please try asking about: student visa, tourist visa, work visa, documents, rejection, processing time, interview, appointment, or financial proof.",
  };

  // ---------------------------------------
  // 🔍 MATCH USER MESSAGE TO PREDEFINED ANSWERS
  // ---------------------------------------
  const getPreAnswer = (question: string) => {
    const q = question.toLowerCase();

    if (q.includes("student") && q.includes("document"))
      return preAnswers["student visa documents"];

    if (q.includes("tourist") && q.includes("document"))
      return preAnswers["tourist visa documents"];

    if (q.includes("work") && q.includes("document"))
      return preAnswers["work visa documents"];

    if (q.includes("reject"))
      return preAnswers["visa rejection"];

    if (q.includes("process") || q.includes("time"))
      return preAnswers["processing time"];

    if (q.includes("appointment"))
      return preAnswers["visa appointment"];

    if (q.includes("interview"))
      return preAnswers["visa interview"];

    if (q.includes("financial") || q.includes("fund") || q.includes("bank"))
      return preAnswers["financial proof"];

    return preAnswers.default;
  };

  // ---------------------------------------
  // 🚀 SEND MESSAGE (NO AI)
  // ---------------------------------------
  const sendMessage = (question: string) => {
    if (!question.trim()) return;

    const userMsg: Message = { role: "user", text: question };
    const botReply = getPreAnswer(question);

    const aiMsg: Message = {
      role: "ai",
      text: botReply,
      meta: { source: "predefined" },
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    scrollToBottom();
  };

  // UI Handlers
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleSuggestionClick = (q: string) => {
    sendMessage(q);
  };

  // Scroll
  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Dark Mode
  useEffect(() => {
    const stored = localStorage.getItem(CONFIG.themeKey);
    if (stored === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(CONFIG.themeKey, darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((p) => !p);

  // ---------------------------------------
  // UI (unchanged)
  // ---------------------------------------
  return (
    <main
      className={`min-h-screen flex flex-col transition-colors duration-700 font-sans ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <header
        className={`flex justify-between items-center p-5 bg-gradient-to-r ${CONFIG.accentGradient} text-white shadow-md sticky top-0 z-50`}
      >
        <div>
          <Link href="/about">
            <h1 className="text-2xl font-extrabold tracking-wide drop-shadow-md hover:underline cursor-pointer">
              {CONFIG.title}
            </h1>
          </Link>
          <p className="text-sm opacity-90">{CONFIG.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm opacity-80 hidden sm:inline">Customer-friendly mode</span>
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium shadow-md transition ${
              darkMode ? "bg-gray-200 text-gray-800" : "bg-gray-800 text-white"
            }`}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* SUGGESTIONS */}
      <section
        className={`p-4 sticky top-[72px] z-40 backdrop-blur-md rounded-xl mx-3 mt-3 shadow-sm ${
          darkMode ? "bg-white/6 border border-gray-700" : "bg-white/80 border border-gray-200"
        }`}
      >
        <div className="flex flex-col gap-3">
          {/* Your suggestions untouched */}
        </div>
      </section>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className={`max-w-xl p-3 rounded-xl shadow-sm text-sm whitespace-pre-line leading-relaxed ${
                msg.role === "user"
                  ? "ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  : darkMode
                  ? "mr-auto bg-gray-800 text-gray-100 border border-gray-700"
                  : "mr-auto bg-white text-gray-900 border border-gray-200"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div
        className={`p-4 flex gap-2 sticky bottom-0 backdrop-blur-md border-t ${
          darkMode ? "bg-gray-900/90 border-gray-700" : "bg-white/70 border-gray-300"
        }`}
      >
        <input
          type="text"
          className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${
            darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-400"
          }`}
          placeholder="✈ Ask anything about visas..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-md"
        >
          Send
        </button>
      </div>
    </main>
  );
}
