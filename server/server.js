// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔹 Predefined answers
const predefinedAnswers = {
  "What are the three most important values in life?": 
    "🌱 Many consider honesty, compassion, and perseverance as guiding values that shape a meaningful life.",
  "How do I overcome fear of failure?": 
    "💡 View failure as feedback, not defeat. Break goals into small steps and celebrate progress.",
  "How can I make learning new skills faster?": 
    "⚡ Use active recall, spaced repetition, and learn by teaching others.",
  "What is AI?":
    "Computer actions that mimic human decision making based on learned experiences and data.",
  "What is ML?":
    "Processes that allow computers to derive conclusions from data.",
  "What is the difference between AI and ML?":
    "ML is a subset of AI that enables the ability for computers to learn outside of their programming.",
  "How will AI change jobs in the next decade?": 
    "🤖 AI will automate routine tasks, create new roles in AI ethics & engineering, and reshape industries.",
  "What is quantum computing in simple terms?": 
    "🌀 Quantum computing uses qubits that can be 0 and 1 at the same time, enabling powerful parallel processing.",
  "How does blockchain work?": 
    "⛓️ Blockchain is a decentralized ledger where data is stored in secure, linked blocks.",
  "What is the future of renewable energy tech?": 
    "🌞 Expect cheaper solar, efficient wind, and breakthroughs in energy storage and fusion.",
  "What’s the fastest way to learn coding?": 
    "💻 Build projects, practice daily, and learn by solving real-world problems.",
  "What are the top 5 emerging technologies in 2025?": 
    "🚀 AI assistants, quantum computing, advanced biotech, green hydrogen, and immersive AR/VR."
};

// 🔹 API route
app.post("/api/ask", (req, res) => {
  const { question } = req.body;

  // Lookup answer
  const answer = predefinedAnswers[question] 
    || "🤖 Sorry, I don’t have a predefined answer for that yet.";

  res.json({ answer });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
