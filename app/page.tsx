'use client';

import { useState, useEffect, useRef } from 'react';

type Message = { 
  role: 'user' | 'ai'; 
  text: string;
  timestamp: Date;
  id: string;
  category?: string;
  sentiment?: 'positive' | 'neutral' | 'curious';
};

type UserProfile = {
  name: string;
  learningStyle: 'visual' | 'practical' | 'theoretical' | 'conversational';
  interests: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  streak: number;
  totalChats: number;
  favoriteTopics: string[];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // UNIQUE FEATURE 1: Smart Category-Based Learning Paths
  const learningPaths = [
    {
      category: '🎯 Career Growth',
      icon: '📈',
      color: 'from-emerald-500 to-teal-600',
      questions: [
        'How do I transition to a tech career?',
        'What skills are most valuable in 2025?',
        'How to negotiate a better salary?',
        'Building a personal brand strategy',
      ],
    },
    {
      category: '🧠 Mental Models',
      icon: '💭',
      color: 'from-purple-500 to-pink-600',
      questions: [
        'What is first principles thinking?',
        'How to make better decisions under pressure?',
        'Understanding cognitive biases',
        'Systems thinking explained',
      ],
    },
    {
      category: '🚀 Startup & Innovation',
      icon: '💡',
      color: 'from-orange-500 to-red-600',
      questions: [
        'How to validate a startup idea?',
        'What makes a great MVP?',
        'Finding product-market fit',
        'Fundraising strategies for beginners',
      ],
    },
    {
      category: '⚡ Productivity Hacks',
      icon: '⏱️',
      color: 'from-blue-500 to-cyan-600',
      questions: [
        'The Pomodoro Technique explained',
        'How to build a second brain?',
        'Deep work vs shallow work',
        'Time blocking for maximum output',
      ],
    },
    {
      category: '🤖 AI & Future Tech',
      icon: '🔮',
      color: 'from-indigo-500 to-purple-600',
      questions: [
        'How will AI agents change work?',
        'Understanding GPT and LLMs',
        'Quantum computing for beginners',
        'The future of human-AI collaboration',
      ],
    },
    {
      category: '💪 Personal Development',
      icon: '🌟',
      color: 'from-yellow-500 to-orange-600',
      questions: [
        'Building unshakeable confidence',
        'The science of habit formation',
        'Overcoming imposter syndrome',
        'Emotional intelligence mastery',
      ],
    },
  ];

  // UNIQUE FEATURE 2: Comprehensive answer database with learning style adaptation
  const predefinedAnswers: Record<string, Record<string, string>> = {
    'How do I transition to a tech career?': {
      visual: '🎯 TECH CAREER TRANSITION ROADMAP:\n\n┌─ ASSESS (Month 1-2)\n│  • Identify transferable skills\n│  • Research roles: Developer, PM, Designer, Data\n│  • Take skill assessments\n│\n├─ LEARN (Month 3-6)\n│  • Pick ONE path (coding/design/product)\n│  • Online courses: freeCodeCamp, Coursera\n│  • Build 2-3 portfolio projects\n│\n├─ NETWORK (Month 4-8)\n│  • LinkedIn optimization\n│  • Tech meetups & communities\n│  • Coffee chats with insiders\n│\n└─ APPLY (Month 6-12)\n    • Tailor resume for ATS\n    • Apply to 5-10 jobs/week\n    • Practice technical interviews\n\nPro tip: Start with a bootcamp or nanodegree for structured learning!',
      practical: '🚀 ACTION PLAN - TECH CAREER SWITCH:\n\nWEEK 1-2: Take Action\n✓ Create GitHub account\n✓ Build your first project (Todo app, calculator)\n✓ Join tech Discord/Slack communities\n\nMONTH 1-3: Skill Building\n✓ Complete one coding bootcamp or course\n✓ Contribute to open source (good first issues)\n✓ Build 3 real projects you can demo\n\nMONTH 3-6: Job Hunting\n✓ Apply to junior roles AND internships\n✓ Do 50+ LeetCode problems if applying for dev\n✓ Network: Comment on LinkedIn, attend meetups\n\nReal example: Sarah, accountant to frontend dev in 8 months by coding 2hrs daily + bootcamp.',
      theoretical: '📚 COMPREHENSIVE TECH TRANSITION FRAMEWORK:\n\nCONCEPTUAL FOUNDATION:\nTech careers reward problem-solving + continuous learning over credentials. The barrier to entry has lowered due to democratized education.\n\nKEY PRINCIPLES:\n1. Leverage Transfer - Your domain expertise is valuable\n2. T-Shaped Skills - Deep in one area, broad awareness of adjacent fields\n3. Signal vs Noise - Portfolio beats Degree in tech\n\nSTRATEGIC APPROACH:\n• Market Research: Analyze job postings, identify skill gaps\n• Skill Acquisition: Formal (bootcamp) + Informal (self-study)\n• Proof of Work: GitHub commits, deployed projects, technical writing\n• Network Effects: Referrals account for 30-50% of tech hires\n\nCRITICAL SUCCESS FACTORS: Consistency, building in public, genuine curiosity.',
      conversational: 'Hey! So you want to break into tech? I love it - and it is totally doable! 🎉\n\nHere is the real talk: you do not need a CS degree. I have seen teachers, nurses, and even a former chef become successful developers.\n\nStart here:\n1. Pick your path - coding, design, product, or data. Try each for a week.\n2. Learn by building - forget just watching tutorials. Make stuff!\n3. Show your work - GitHub, LinkedIn, Twitter. Document your journey.\n4. Connect with humans - tech Twitter is gold. Comment, share, engage.\n\nThe secret sauce? Consistency beats intensity. 1 hour daily for 6 months beats cramming weekends.\n\nYou have got this! 💪',
    },

    'What skills are most valuable in 2025?': {
      visual: '💎 TOP SKILLS 2025:\n\n[HIGH DEMAND + HIGH PAY]\n━━━━━━━━━━━━━━━━━━━━\n🤖 AI/ML Engineering\n📊 Data Science & Analytics\n☁️ Cloud Architecture\n🔒 Cybersecurity\n💻 Full-Stack Development\n\n[RISING FAST]\n━━━━━━━━━━\n✍️ Prompt Engineering\n🎨 AI-Assisted Design\n📱 No-Code/Low-Code\n🔗 Blockchain\n\n[TIMELESS]\n━━━━━━━━━━\n💬 Communication\n🎯 Critical Thinking\n🤝 Emotional Intelligence\n📈 Sales & Persuasion\n\nCombine technical + soft skills!',
      practical: '🎯 ACTIONABLE SKILL PLAN:\n\nTECH SKILLS (Pick 1-2):\n✓ Learn Python or JavaScript (3 months)\n✓ Master Excel + SQL (1 month)\n✓ Use ChatGPT for automation (ongoing)\n✓ Build 3 projects to showcase\n\nSOFT SKILLS (Daily):\n✓ Write clear emails/messages\n✓ Practice active listening\n✓ Learn to say no diplomatically\n✓ Give presentations\n\nHIGH-ROI MOVES:\n• Public speaking course → 10x influence\n• Learn basic design → stand out\n• Master storytelling → sell ideas\n• Build online presence\n\nStart today: Pick ONE skill, 30 mins daily for 30 days.',
      theoretical: '📚 2025 SKILLS LANDSCAPE:\n\nMACRO TRENDS:\n1. AI Augmentation - Every job involves AI\n2. Remote Work - Communication critical\n3. Automation - Routine tasks disappearing\n4. Specialization + Versatility paradox\n\nSKILL CATEGORIES:\n\nTECHNICAL: AI/ML, Data, Cloud, Security\nCOGNITIVE: Systems thinking, First principles\nSOCIAL: Persuasion, Cross-cultural communication\n\nKEY INSIGHT: Learn to learn. Specific tools change, but meta-skills compound forever.',
      conversational: 'Great question! The job market is wild right now.\n\n🔥 HOTTEST:\nAnything AI-related. If you can use ChatGPT/Claude effectively, you are ahead of 80% of people.\n\nSecret: Do not just learn AI. Learn AI + your domain. AI + marketing = gold.\n\n💪 NEVER DIE:\n• Writing clearly\n• Speaking confidently\n• Selling ideas\n• Understanding people\n\nMy friend Jake learned Python + data analysis. Doubled his salary in 6 months. Why? He automated boring stuff at work.\n\nMy advice: Pick ONE technical skill and ONE soft skill. Give it 90 days.\n\nWhat is your current role? I can suggest specific skills!',
    },

    'How to negotiate a better salary?': {
      visual: '💰 SALARY NEGOTIATION:\n\n[RESEARCH]\n     ↓\n┌─ Market rate\n│  Company budget\n│  Your leverage\n│\n├─ BUILD CASE\n│  List achievements\n│  Quantify impact\n│  Gather offers\n│\n├─ NEGOTIATE\n│  1. Let them talk\n│  2. Anchor high\n│  3. Stay silent\n│  4. Get creative\n│\n└─ CLOSE\n    Get it in writing\n    Celebrate! 🎉\n\nGOLDEN RULE: Never accept first offer.',
      practical: '🚀 NEGOTIATION GUIDE:\n\nWEEK BEFORE:\n1. Research on Glassdoor, Levels.fyi\n2. Document your wins\n3. Get competing offers\n\nDURING CALL:\n1. "What is the range for this role?"\n2. Let THEM say number first\n3. Pause 5 seconds (silence = power)\n4. Counter 15-20% higher\n5. Justify with specific value\n\nIF NO:\n• "Flexibility on signing bonus?"\n• "Revisit in 3 months?"\n• "Extra PTO or remote flexibility?"\n\nEXAMPLE:\nOffer: $80k\nYou: [silence] "I was hoping $95k"\nThem: "Best is $88k"\nYou: "$5k signing bonus + 6 month review?"\nWIN!\n\nNEVER accept on spot. "Let me review by tomorrow."',
      theoretical: '📚 NEGOTIATION PSYCHOLOGY:\n\nCORE PRINCIPLES:\n1. Anchoring Effect - First number sets range\n2. Loss Aversion - They do not want to lose you\n3. Reciprocity - Give to get\n4. BATNA - Best Alternative\n\nPOWER DYNAMICS:\nLeverage = f(Options, Timing, Demand)\n\nMISTAKES:\n1. Accepting first offer (-10-20%)\n2. Justifying with personal needs\n3. Lying about offers\n4. Negotiating too early\n\nSTRATEGY:\n1. Delay until offer stage\n2. Research market rate\n3. Let them anchor OR anchor high\n4. Negotiate total compensation\n5. Use silence\n6. Get competing offers\n\nKEY: Negotiation is expected. Not negotiating signals low confidence.',
      conversational: 'Oh man, favorite topic! Most people leave SO much money on the table.\n\nWRONG:\n❌ "I need $X for rent" - They do not care\n❌ Accept first offer - Always mistake\n❌ Feel guilty - Companies EXPECT this\n\nWORKS:\n\n1. DO HOMEWORK: Glassdoor, Levels.fyi. Add 15-20%.\n\n2. TIMING: Never talk numbers until they want you.\n\n3. MAKE THEM GO FIRST:\n"What were you thinking?"\n\n4. SILENCE POWER:\nThem: "$80k"\nYou: [5 seconds]\nThem: "Maybe $85k"\n\nWorks every time! 😄\n\n5. NEVER ACCEPT ON SPOT:\n"Let me review tomorrow."\n\nMy friend Sarah: Offered $90k, asked $105k, got $98k + bonus. Extra $8k/year FOREVER.\n\nWorst they say is no. And they almost never do.\n\nWant to walk through your scenario?',
    },

    'Building a personal brand strategy': {
      visual: '🎯 PERSONAL BRAND:\n\n[WHO ARE YOU?]\n      ↓\n   FOUNDATION\n   • Expertise\n   • Values\n   • Unique POV\n      ↓\n   CONTENT HUB\n   Pick 1-2:\n   • LinkedIn\n   • Twitter/X\n   • Newsletter\n      ↓\n   CONSISTENCY\n   • 3x/week\n   • Same topics\n   • Same voice\n      ↓\n   ENGAGE\n   • Comment 5x\n   • DM people\n   • Collaborate\n      ↓\n  [BRAND EQUITY]\n\nExpertise × Visibility × Authenticity = Brand Value',
      practical: '🚀 30-DAY BRAND LAUNCH:\n\nWEEK 1:\n✓ Define niche (AI + Marketing)\n✓ Update LinkedIn/Twitter\n✓ Write origin story\n\nWEEK 2:\n✓ Create 10 content ideas\n✓ Write 3 posts\n✓ Schedule for 2 weeks\n\nWEEK 3:\n✓ Comment on 5 posts daily\n✓ DM 3 people you admire\n✓ Share others content\n\nWEEK 4:\n✓ Post 3x this week\n✓ Start weekly series\n✓ Engage with comments\n\nCONTENT IDEAS:\n• "3 mistakes I made in [field]"\n• "How I [result] in [time]"\n• "Unpopular opinion about [topic]"\n\nQUICK WINS:\n• Professional photo\n• Simple language\n• Personal stories\n• 3x/week minimum',
      theoretical: '📚 PERSONAL BRANDING:\n\nDEFINITION:\nYour brand = What people say when you are not there. Intersection of expertise, values, communication.\n\nCOMPONENTS:\n\n1. POSITIONING\n• Niche: Broad to grow, narrow to own\n• Differentiation: Unique POV\n• Target: Who needs you?\n\n2. CONTENT PILLARS (3-4)\n• Core expertise\n• Adjacent skill\n• Lessons learned\n• Industry insights\n\n3. CHANNELS\n• Owned: Newsletter, blog\n• Earned: Guest posts, podcasts\n• Social: LinkedIn, Twitter\n\n4. ENGAGEMENT\n• Give > Ask (80/20)\n• Consistent > Perfect\n• Relationships > Followers\n\n5. METRICS\n• Vanity: Followers, likes\n• Real: DMs, opportunities, revenue\n\nPRINCIPLES:\n• Authenticity compounds\n• Consistency beats intensity\n• Network effects real\n• Brand = Career insurance',
      conversational: 'Building a personal brand changed my life. Let me share what works:\n\nForget fake stuff. Do not be Gary Vee. YOUR story, YOUR voice - that is your advantage.\n\nSIMPLE FRAMEWORK:\n\n1. PICK LANE:\nNot "a marketer." Be "helps SaaS get first 100 customers."\nSpecific = Memorable\n\n2. SHOW UP:\nI post 3x/week. Monday, Wednesday, Friday. Like gym - consistency builds muscle.\n\n3. GIVE VALUE:\n• "Exact email that got 5 clients"\n• "3 mistakes cost me $10k"\n• "What I wish I knew"\n\n4. ENGAGE HUMAN:\nComment. DM. Thank people. Most do not, so huge differentiator.\n\n5. BE PATIENT:\nFirst 6 months: crickets 🦗\nMonths 6-12: Few comments\nYear 2: Opportunities rolled in\n\nNow? Job offers weekly without applying.\n\nSTART TODAY:\n• Update LinkedIn headline\n• Write one lesson post\n• Comment on 5 posts\n\nWhat is your expertise? Let us craft your first post!',
    },

    'What is first principles thinking?': {
      visual: '🧠 FIRST PRINCIPLES:\n\n[Problem/Assumption]\n       ↓\n┌──────────────────┐\n│ BREAK IT DOWN    │\n│ Into basic truths│\n└──────────────────┘\n       ↓\n┌──────────────────┐\n│ QUESTION EACH    │\n│ assumption       │\n└──────────────────┘\n       ↓\n┌──────────────────┐\n│ REBUILD from     │\n│ ground up        │\n└──────────────────┘\n       ↓\n  [New Solution]\n\nEXAMPLE - SpaceX:\n❌ "Rockets expensive" → Accept\n✅ "What ARE rockets? Raw materials cost?" → Build cheaper\n\nWhen stuck, ask "What do I know is absolutely true?" Start there.',
      practical: '⚡ FIRST PRINCIPLES IN ACTION:\n\nSTEP-BY-STEP:\n\n1. Identify problem:\n   "Cannot afford gym"\n\n2. Break to fundamentals:\n   • Need equipment for fit?\n   • What IS fitness? (strength + cardio + flexibility)\n   • Cheapest way for each?\n\n3. Rebuild:\n   • Strength: Bodyweight (free)\n   • Cardio: Running (free)\n   • Flexibility: YouTube yoga (free)\n   → No gym needed!\n\nTRY NOW:\nPick a problem. Ask "Why?" 5 times to get core truth. Build from there.\n\nElon uses this for everything. You can too!',
      theoretical: '🎓 FIRST PRINCIPLES - FOUNDATION:\n\nORIGINS:\nAristotle: "First basis from which thing is known." Reasoning from foundational truths vs analogy.\n\nMETHODOLOGY:\n1. Deconstruction - Break to basic elements\n2. Verification - Identify provably true vs assumed\n3. Reconstruction - Build from verified truths\n\nVS ANALOGICAL:\n• Analogy: "Others do X, so should I"\n• First Principles: "What is fundamental nature of X?"\n\nAPPLICATIONS:\n• Science: Newton, Einstein\n• Business: Musk, Bezos\n• Personal: Any domain conventions may be wrong\n\nLIMITATIONS: Time-intensive, requires deep domain knowledge, not always necessary.',
      conversational: 'Ah, first principles! Favorite thinking tool. 🧠\n\nImagine building with LEGO. Most copy designs (analogies). First principles? Dump blocks out and think: "What can I build with THESE pieces?"\n\nReal example:\nEveryone said "Need office for business." I asked: "Do I REALLY? What do I ACTUALLY need?" Turns out: laptop + WiFi. Boom - remote business.\n\nElon famous for this. Told rockets cost millions, he did not accept. Asked: "What IS rocket? Metal + fuel + computers. How much REALLY?" Way less than NASA paid.\n\nHow to use:\n1. Stop accepting "that is how it is done"\n2. Ask "what is fundamentally true?"\n3. Build own path from truths\n\nLike being kid again - questioning everything! Try it on a problem?',
    },
  };

  // UNIQUE FEATURE 3: Adaptive difficulty based on user level
  const getPersonalizedResponse = (question: string, profile: UserProfile | null): string => {
    const learningStyle = profile?.learningStyle || 'conversational';
    const skillLevel = profile?.skillLevel || 'beginner';
    
    // First, check if we have a learning-style-specific answer
    if (predefinedAnswers[question]) {
      if (predefinedAnswers[question][learningStyle]) {
        return predefinedAnswers[question][learningStyle];
      }
      // If not in the user's preferred style, return any available style
      const availableStyles = Object.keys(predefinedAnswers[question]);
      if (availableStyles.length > 0) {
        return predefinedAnswers[question][availableStyles[0]];
      }
    }
    
    // Enhanced fallback response with personalization
    const stylePrefix = {
      visual: '📊 VISUAL BREAKDOWN:\n\n',
      practical: '🎯 ACTION STEPS:\n\n',
      theoretical: '📚 DEEP DIVE:\n\n',
      conversational: 'Great question! Let me break this down:\n\n',
    };
    
    const styleSuffix = {
      visual: '\n\n💡 TIP: Try creating a mind map or diagram of this concept to visualize the connections!',
      practical: '\n\n💡 TIP: The best way to learn is by doing. Start with a small project today!',
      theoretical: '\n\n💡 TIP: Dive deeper by reading research papers and case studies on this topic.',
      conversational: '\n\n💡 TIP: Want to chat more about this? Ask me follow-up questions!',
    };
    
    return `${stylePrefix[learningStyle]}I would love to give you a detailed answer about "${question}"!\n\nThis is a ${skillLevel}-level topic. ${
      profile ? `Based on your interest in ${profile.interests[0] || 'learning'}, ` : ''
    }here is what I recommend:\n\n${
      learningStyle === 'visual' 
        ? '• Look for infographics and diagrams\n• Create a visual mind map\n• Watch explainer videos with animations' :
      learningStyle === 'practical' 
        ? '• Find a hands-on tutorial or course\n• Build a small project to apply the concept\n• Practice with real examples' :
      learningStyle === 'theoretical' 
        ? '• Read academic papers or books on the subject\n• Study the foundational principles\n• Explore different theoretical frameworks' :
        '• Join discussion forums and communities\n• Ask experts for their perspectives\n• Learn through conversation and storytelling'
    }${styleSuffix[learningStyle]}`;
  };

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const savedMessages = localStorage.getItem('chatHistory');
    const savedProfile = localStorage.getItem('userProfile');
    const lastVisit = localStorage.getItem('lastVisit');
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
    
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as UserProfile;
        setUserProfile(profile);
        setShowWelcome(false);
        
        // Calculate streak
        if (lastVisit) {
          const daysSince = Math.floor((Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24));
          if (daysSince === 1) {
            profile.streak += 1;
            setUserProfile(profile);
            localStorage.setItem('userProfile', JSON.stringify(profile));
          } else if (daysSince > 1) {
            profile.streak = 1;
            setUserProfile(profile);
            localStorage.setItem('userProfile', JSON.stringify(profile));
          }
        }
        setCurrentStreak(profile.streak || 0);
      } catch (e) {
        console.error('Error parsing profile:', e);
      }
    }
    
    localStorage.setItem('lastVisit', new Date().toISOString());

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = typeof window !== 'undefined' && window.matchMedia 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
      : false;
    const theme = savedTheme ?? (prefersDark ? 'dark' : 'light');

    setDarkMode(theme === 'dark');
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newMode);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
    }
  };

  const clearHistory = () => {
    if (typeof window === 'undefined') return;
    
    const userConfirmed = confirm('Clear all chat history?');
    if (userConfirmed) {
      setMessages([]);
      localStorage.removeItem('chatHistory');
    }
  };

  const createProfile = (name: string, learningStyle: UserProfile['learningStyle'], skillLevel: UserProfile['skillLevel'], interests: string[]) => {
    const newProfile: UserProfile = {
      name,
      learningStyle,
      interests,
      skillLevel,
      streak: 1,
      totalChats: 0,
      favoriteTopics: [],
    };
    setUserProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
    }
    setShowProfileSetup(false);
    setShowWelcome(false);
    inputRef.current?.focus();
  };

  const getAIResponse = (question: string, category?: string) => {
    const userMessage: Message = {
      role: 'user',
      text: question,
      timestamp: new Date(),
      id: Date.now().toString(),
      category,
      sentiment: 'curious',
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Update user stats
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        totalChats: userProfile.totalChats + 1,
      };
      setUserProfile(updatedProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      }
    }

    setTimeout(() => {
      const answer = getPersonalizedResponse(question, userProfile);

      const aiMessage: Message = {
        role: 'ai',
        text: answer,
        timestamp: new Date(),
        id: (Date.now() + 1).toString(),
        category,
        sentiment: 'positive',
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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

  // Profile setup screen
  if (showProfileSetup || (showWelcome && !userProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20 p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <span className="text-5xl">🧠</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Welcome to AI GROW
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Your AI learns YOUR way. Let us personalize your experience.
              </p>
            </div>

            <ProfileSetupForm onComplete={createProfile} onSkip={() => setShowWelcome(false)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20 text-gray-900 dark:text-gray-100">
      {/* Header with Stats */}
      <header className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI GROW
            </h1>
            {userProfile && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  Hey {userProfile.name}!
                </span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full text-[10px] font-bold">
                  🔥 {currentStreak} day streak
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {userProfile && (
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all text-sm font-medium"
              title="Your learning stats"
            >
              📊
            </button>
          )}
          <button
            onClick={clearHistory}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
            title="Clear chat history"
          >
            🗑️
          </button>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Stats Panel */}
      {showStats && userProfile && (
        <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="text-3xl font-bold">{userProfile.totalChats}</div>
              <div className="text-sm opacity-90">Total Chats</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
              <div className="text-3xl font-bold">{currentStreak}</div>
              <div className="text-sm opacity-90">Day Streak 🔥</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white">
              <div className="text-xl font-bold capitalize">{userProfile.learningStyle}</div>
              <div className="text-sm opacity-90">Learning Style</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-4 text-white">
              <div className="text-xl font-bold capitalize">{userProfile.skillLevel}</div>
              <div className="text-sm opacity-90">Skill Level</div>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Learning Paths */}
      {messages.length === 0 && (
        <section className="p-6 space-y-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {userProfile 
                  ? `${userProfile.name}, what do you want to master today?` 
                  : 'Choose Your Learning Path'}
              </h2>
              {userProfile && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimized for {userProfile.learningStyle} learners • {userProfile.skillLevel} level
                </p>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {learningPaths.map((path, idx) => (
                <div
                  key={idx}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {path.icon}
                    </div>
                    <h3 className="font-bold text-lg bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      {path.category.replace(/^[^\s]+ /, '')}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {path.questions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => getAIResponse(q, path.category)}
                        className={`w-full px-4 py-3 text-sm text-left rounded-xl bg-gradient-to-r ${path.color} bg-opacity-10 hover:bg-opacity-100 hover:text-white border border-transparent hover:border-white/20 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group-hover:border-gray-200 dark:group-hover:border-gray-600`}
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

      {/* Chat Messages with Enhanced UI */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
            >
              <div className="flex items-end gap-2 max-w-[85%] md:max-w-[75%]">
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg mb-1 flex-shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm border-2 border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {msg.category && msg.role === 'ai' && (
                    <div className="text-xs font-semibold mb-2 opacity-70">
                      {msg.category}
                    </div>
                  )}
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {formatMessage(msg.text)}
                  </div>
                  <div
                    className={`text-[10px] mt-2 flex items-center gap-2 ${
                      msg.role === 'user'
                        ? 'text-indigo-100'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}
                  >
                    <span>{msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                    {msg.role === 'user' && <span>✓✓</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-slideIn">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg mb-1 flex-shrink-0">
                  AI
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-sm shadow-lg border-2 border-indigo-200 dark:border-indigo-800">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className="sticky bottom-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-2">
            <input
              ref={inputRef}
              className="flex-1 px-5 py-4 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 shadow-lg"
              placeholder={userProfile ? `Ask me anything, ${userProfile.name}... I will adapt to your ${userProfile.learningStyle} style!` : "Ask me anything..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold hover:shadow-2xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              Send ✨
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 px-2">
            <span>
              🧠 Powered by AI GROW • Adapts to your learning style
            </span>
            {userProfile && (
              <button
                onClick={() => setShowProfileSetup(true)}
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                ⚙️ Update preferences
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </main>
  );
}

// Profile Setup Component
function ProfileSetupForm({ 
  onComplete, 
  onSkip 
}: { 
  onComplete: (name: string, style: UserProfile['learningStyle'], level: UserProfile['skillLevel'], interests: string[]) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [learningStyle, setLearningStyle] = useState<UserProfile['learningStyle']>('conversational');
  const [skillLevel, setSkillLevel] = useState<UserProfile['skillLevel']>('beginner');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    'Career Growth', 'AI & Tech', 'Entrepreneurship', 
    'Personal Development', 'Productivity', 'Finance',
    'Health & Fitness', 'Creative Skills', 'Leadership'
  ];

  const handleComplete = () => {
    if (name && selectedInterests.length > 0) {
      onComplete(name, learningStyle, skillLevel, selectedInterests);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center">What should I call you?</h3>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && name && setStep(2)}
          />
          <button
            onClick={() => name && setStep(2)}
            disabled={!name}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center">How do you learn best?</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'visual', label: '📊 Visual', desc: 'Diagrams & charts' },
              { value: 'practical', label: '🎯 Practical', desc: 'Hands-on steps' },
              { value: 'theoretical', label: '📚 Theoretical', desc: 'Deep concepts' },
              { value: 'conversational', label: '💬 Conversational', desc: 'Chat-style' },
            ].map((style) => (
              <button
                key={style.value}
                onClick={() => setLearningStyle(style.value as UserProfile['learningStyle'])}
                className={`p-4 rounded-xl border-2 transition-all ${
                  learningStyle === style.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                <div className="font-bold">{style.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{style.desc}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Next →
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center">Your skill level?</h3>
          <div className="space-y-2">
            {[
              { value: 'beginner', label: '🌱 Beginner', desc: 'Just starting out' },
              { value: 'intermediate', label: '🚀 Intermediate', desc: 'Some experience' },
              { value: 'advanced', label: '⚡ Advanced', desc: 'Deep knowledge' },
            ].map((level) => (
              <button
                key={level.value}
                onClick={() => setSkillLevel(level.value as UserProfile['skillLevel'])}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  skillLevel === level.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                <div className="font-bold">{level.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{level.desc}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(4)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Next →
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center">What interests you? (Pick 2-3)</h3>
          <div className="grid grid-cols-2 gap-2">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => {
                  if (selectedInterests.includes(interest)) {
                    setSelectedInterests(selectedInterests.filter(i => i !== interest));
                  } else if (selectedInterests.length < 3) {
                    setSelectedInterests([...selectedInterests, interest]);
                  }
                }}
                className={`p-3 rounded-xl border-2 transition-all text-sm ${
                  selectedInterests.includes(interest)
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 font-bold'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <button
            onClick={handleComplete}
            disabled={selectedInterests.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Learning! 🚀
          </button>
        </div>
      )}

      <button
        onClick={onSkip}
        className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors text-sm"
      >
        Skip setup
      </button>
    </div>
  );
}
