'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Message = {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
  id: string;
  category?: string;
  isTyping?: boolean;
  tokens?: number;
  reaction?: '👍' | '💡' | '🔥' | '📌';
};

type UserProfile = {
  name: string;
  learningStyle: 'visual' | 'practical' | 'theoretical' | 'conversational';
  interests: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  streak: number;
  totalChats: number;
  xp: number;
  level: number;
  achievements: string[];
  lastVisit: string;
};

type LearningPath = {
  category: string;
  icon: string;
  color: string;
  accent: string;
  questions: string[];
  description: string;
};

type Tab = 'chat' | 'paths' | 'progress' | 'settings';

// ─── XP + LEVELING ────────────────────────────────────────────────────────────

const XP_PER_CHAT = 15;
const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1100, 1500, 2100, 3000];
const LEVEL_NAMES = ['Seedling', 'Sprout', 'Learner', 'Explorer', 'Thinker',
  'Strategist', 'Visionary', 'Expert', 'Master', 'Legend'];

function getLevelInfo(xp: number) {
  let level = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) { level = i; break; }
  }
  const next = LEVEL_THRESHOLDS[level + 1] ?? LEVEL_THRESHOLDS[level];
  const curr = LEVEL_THRESHOLDS[level];
  const progress = next > curr ? Math.round(((xp - curr) / (next - curr)) * 100) : 100;
  return { level, name: LEVEL_NAMES[level], progress, xpToNext: next - xp };
}

// ─── ACHIEVEMENT DEFINITIONS ─────────────────────────────────────────────────

const ACHIEVEMENTS = [
  { id: 'first_chat', label: '🎉 First Question', desc: 'Asked your first question', trigger: (p: UserProfile) => p.totalChats >= 1 },
  { id: 'streak_3', label: '🔥 On Fire', desc: '3-day learning streak', trigger: (p: UserProfile) => p.streak >= 3 },
  { id: 'streak_7', label: '⚡ Week Warrior', desc: '7-day learning streak', trigger: (p: UserProfile) => p.streak >= 7 },
  { id: 'chats_10', label: '💬 Curious Mind', desc: '10 conversations', trigger: (p: UserProfile) => p.totalChats >= 10 },
  { id: 'chats_25', label: '🚀 Power Learner', desc: '25 conversations', trigger: (p: UserProfile) => p.totalChats >= 25 },
  { id: 'level_3', label: '🌟 Explorer', desc: 'Reached Level 3', trigger: (p: UserProfile) => p.xp >= LEVEL_THRESHOLDS[3] },
  { id: 'level_5', label: '🎯 Strategist', desc: 'Reached Level 5', trigger: (p: UserProfile) => p.xp >= LEVEL_THRESHOLDS[5] },
];

// ─── LEARNING PATHS ───────────────────────────────────────────────────────────

const learningPaths: LearningPath[] = [
  {
    category: 'Career Growth',
    icon: '📈',
    color: 'from-emerald-600 to-teal-700',
    accent: '#10b981',
    description: 'Navigate career transitions, salary negotiations, and professional development.',
    questions: [
      'How do I transition to a tech career?',
      'What skills are most valuable in 2025?',
      'How to negotiate a better salary?',
      'Building a personal brand strategy',
      'How to get promoted faster?',
      'How to find a mentor?',
      'How to switch industries without starting over?',
      'How to stand out in job applications?',
    ],
  },
  {
    category: 'Mental Models',
    icon: '💭',
    color: 'from-violet-600 to-purple-700',
    accent: '#8b5cf6',
    description: 'Upgrade your thinking with frameworks used by top performers worldwide.',
    questions: [
      'What is first principles thinking?',
      'How to make better decisions under pressure?',
      'Understanding cognitive biases',
      'Systems thinking explained',
      'How to think more creatively?',
      'How to develop better judgment?',
      'How to learn anything faster?',
      'How does compounding work in life?',
    ],
  },
  {
    category: 'Startup & Innovation',
    icon: '🚀',
    color: 'from-orange-600 to-red-700',
    accent: '#f97316',
    description: 'Build, validate, and scale ideas that solve real problems.',
    questions: [
      'How to validate a startup idea?',
      'What makes a great MVP?',
      'Finding product-market fit',
      'Fundraising strategies for beginners',
      'How to price your product?',
      'How to build a startup team?',
      'What is the lean startup method?',
      'How to find your first customers?',
    ],
  },
  {
    category: 'Productivity',
    icon: '⚡',
    color: 'from-blue-600 to-cyan-700',
    accent: '#3b82f6',
    description: 'Reclaim your time and energy with proven systems that stick.',
    questions: [
      'The Pomodoro Technique explained',
      'How to build a second brain?',
      'Deep work vs shallow work',
      'Time blocking for maximum output',
      'How to eliminate distractions?',
      'How to prioritize when everything feels urgent?',
      'How to stop procrastinating?',
      'How to have more energy throughout the day?',
    ],
  },
  {
    category: 'AI & Future Tech',
    icon: '🤖',
    color: 'from-indigo-600 to-blue-700',
    accent: '#6366f1',
    description: 'Stay ahead of the AI revolution and future-proof your skills.',
    questions: [
      'How will AI agents change work?',
      'Understanding GPT and LLMs',
      'Quantum computing for beginners',
      'The future of human-AI collaboration',
      'How to use AI to learn faster?',
      'What is prompt engineering?',
      'How to stay relevant as AI advances?',
      'How does machine learning actually work?',
    ],
  },
  {
    category: 'Personal Growth',
    icon: '🌱',
    color: 'from-rose-600 to-pink-700',
    accent: '#f43f5e',
    description: 'Build the mindset, habits, and confidence to become your best self.',
    questions: [
      'Building unshakeable confidence',
      'The science of habit formation',
      'Overcoming imposter syndrome',
      'Emotional intelligence mastery',
      'How to set and achieve big goals?',
      'How to handle failure and rejection?',
      'How to build better relationships?',
      'How to find your life purpose?',
    ],
  },
];

// ─── ANSWER DATABASE ──────────────────────────────────────────────────────────

const predefinedAnswers: Record<string, Record<string, string>> = {
  'How do I transition to a tech career?': {
    practical: `🚀 TECH CAREER SWITCH — 12-MONTH ROADMAP

━━ MONTH 1-2: LAY THE FOUNDATION ━━
✓ Create a GitHub account TODAY — this is your new resume
✓ Pick ONE stack: Frontend (HTML/CSS/JS → React) or Data (Python + SQL) or Cloud
✓ Build your first tiny project this week — a calculator, a to-do app, anything
✓ Join 2-3 Discord communities in your chosen field (search "[tech] community Discord")

━━ MONTH 3-5: BUILD REAL SKILLS ━━
✓ Complete one focused course (freeCodeCamp for web, Kaggle for data — both FREE)
✓ Build 3 portfolio projects you can actually demo — deploy them publicly
✓ Contribute to open source — search "good first issue" on GitHub
✓ Start sharing your learning journey on LinkedIn (even early posts build credibility)

━━ MONTH 6-9: JOB-READY MODE ━━
✓ Apply to junior roles AND internships simultaneously
✓ Solve 50+ LeetCode problems if targeting developer positions
✓ Get 2+ mock interviews per week via Pramp or interviewing.io
✓ Cold outreach to 5 people at target companies each week — coffee chat, not job ask

━━ MONTH 10-12: LAND THE ROLE ━━
✓ Send 5-10 tailored applications per week (quality over quantity)
✓ Mirror keywords from each job description in your resume
✓ Network at local tech meetups — most cities have free Meetup.com events
✓ Aim for 2 full interviews per month — each one teaches you something

⚡ REAL BENCHMARK: Sarah went from accountant → frontend developer in 8 months coding 2hrs/day + weekend bootcamp. Background does NOT matter. Consistency does.`,
    conversational: `Hey — wanting to break into tech is one of the best moves you can make right now. Let me be real with you about what actually works.

First: you absolutely do not need a computer science degree. The industry genuinely does not care where you studied — it cares what you can build. I know teachers, nurses, lawyers, and a former chef who became successful developers. What they all had in common was consistency, not credentials.

Here is the framework that works:

Pick your lane before you start coding. Web development, data science, product management, cloud engineering, UX design — each has a different path. Spend ONE week exploring each before committing months to the wrong one.

Build things, do not just watch tutorials. This is the trap everyone falls into. Tutorial hell is real — you watch hours of content and feel productive, but when you close the laptop you cannot build anything. The fix: every tutorial you follow, build something DIFFERENT right after using the same concepts.

Show your work publicly from day one. A GitHub profile, some LinkedIn posts about what you are learning, even rough projects on the internet — these create social proof that no resume can replicate. People hire humans they have watched growing.

Talk to 5 real people in tech. Reach out on LinkedIn to people doing the role you want. Ask genuine, specific questions about their path. Most will reply if you are thoughtful and brief. These conversations can unlock opportunities you cannot find through job boards alone.

The uncomfortable truth: one focused hour daily for 6 months beats frantic weekend sprints every single time. The tech career switch is a marathon, not a sprint.

What is your current background? Tell me and I can make this much more specific for you.`
  },
  'What is first principles thinking?': {
    practical: `⚡ FIRST PRINCIPLES — HOW TO USE IT TODAY

THE 3-STEP PROCESS:

STEP 1 — State the problem precisely:
Write down EXACTLY what you are trying to solve.
Example: "I cannot afford a gym membership but want to get fit."

STEP 2 — Break every assumption:
Ask "Why?" and "Is this actually true?" for each assumption.
• "Do I need a gym?" → Fitness = strength + cardio + flexibility
• "What provides each?" → Bodyweight (free), running (free), YouTube yoga (free)  
• "What is a gym providing?" → Equipment, space, routine — all replicable

STEP 3 — Build from confirmed truths only:
Reconstruct the solution using only what you verified is true.
New solution: Home workout + outdoor running + free online classes = $0.

━━ TRY IT ON YOUR CURRENT BIGGEST CHALLENGE ━━
① Write the problem
② List every assumption baked into it
③ Ask "Is this true, or just tradition/convention?"
④ Design a new solution from scratch using only confirmed truths

CLASSIC EXAMPLES:
→ Elon Musk: "Rockets cost $65M" → broke it down to materials → built SpaceX
→ Airbnb founders: "Hotels are expensive" → "What IS hospitality?" → rented air mattresses
→ Netflix: "People go to video stores" → "What do they actually want?" → convenience`,
    conversational: `First principles thinking is one of those ideas that sounds intimidating until someone shows you the LEGO analogy — then it clicks forever.

Imagine you are building with LEGO. Most people look at the box and try to copy the picture. That is reasoning by analogy — doing what has always been done. First principles thinking means dumping all the bricks on the floor and asking: "Given ONLY these pieces, what is the BEST thing I can actually build?"

The real-world story that makes this click:

Elon Musk wanted to buy a rocket for SpaceX. Everyone told him rockets cost $65 million each. He refused to just accept that. He asked: "What IS a rocket? What is it actually made of?"

Aerospace aluminum, titanium, copper, carbon fiber, and rocket fuel. He looked up the raw material costs. They were about 2% of the price of a finished rocket.

So he bought the materials and built his own rockets. SpaceX now launches at a fraction of what NASA paid. He did not invent anything new — he just refused to accept the inherited assumption that rockets had to cost that much.

The question that changes everything: "Is this true because it IS true — or because nobody has questioned it yet?"

How to start right now: pick the biggest constraint in your current situation. Ask "Is this constraint actually fixed, or does it just seem fixed because we inherited it?" Often the answer is the second one.

Give me a real situation you are facing and I will walk you through the first principles breakdown with you.`
  },
  'The science of habit formation': {
    practical: `🧬 BUILD A HABIT THAT ACTUALLY STICKS

THE COREFORMULA:
[OBVIOUS CUE] → [TINY ROUTINE] → [SATISFYING REWARD]

━━ STEP 1: DESIGN YOUR CUE ━━
✓ Habit stack: "After I [existing automatic habit], I will [new habit]"
   Example: "After I pour morning coffee → meditate 2 minutes"
✓ Make it physical: book on your pillow = read before bed
✓ Time + location anchor: "Every day at 7am in my kitchen"

━━ STEP 2: MAKE IT TINY (Most people fail here) ━━
✓ Exercise habit? Start with: "I will put on my gym clothes"
✓ Reading habit? Start with: "I will read one page"
✓ Journaling habit? Start with: "I will write one sentence"
The goal in Week 1 is SHOWING UP, not performance.

━━ STEP 3: REWARD IMMEDIATELY ━━
✓ Visual tracking: X on a calendar — "don't break the chain" is powerful
✓ Micro-celebration: genuine fist pump or verbal "yes!" — trains your dopamine system
✓ Temptation bundling: "I only listen to my favorite podcast while running"

━━ BREAKING BAD HABITS (reverse the formula) ━━
✓ Make the cue invisible — remove the trigger entirely from your environment
✓ Add friction — 5 extra steps between you and the bad behavior
✓ Replace the reward — find a healthier substitute for the same craving

THE GOLDEN RULE: Never miss twice in a row.
Miss once = a slip (normal). Miss twice = beginning of a new (opposite) habit.`,
    conversational: `Habits are genuinely fascinating once you understand what is actually happening in your brain — and once you see the mechanism, building new ones becomes much more deliberate.

Here is what is really going on: every time you repeat a behavior, your brain is literally rewiring itself. It builds thicker, faster neural pathways for that behavior. The more you repeat it, the more automatic it becomes, until it requires almost no conscious thought at all — like brushing your teeth.

The mechanism is a loop: cue → craving → response → reward. Your brain runs this loop millions of times until the loop itself becomes automatic. The trick is to design the loop consciously.

The biggest mistake: starting too big. "I will exercise for an hour every morning" fails after four days because the cost is too high when motivation inevitably dips. "I will put on my gym shoes every morning" almost always succeeds — and most days you end up going to the gym because you are already in the shoes.

The goal in the early days is not performance. The goal is SHOWING UP. Showing up is what reinforces the identity ("I am someone who exercises") and the neural pathway. The quality of the habit follows automatically once the consistency is there.

Environment design is dramatically more powerful than motivation. If you want to read before bed, put the book on your pillow. If you want to eat better, do not buy the junk food. If you want to use your phone less, physically put it in another room. Your environment is running most of your behavior — redesign it in your favor.

And the trick for bad habits: do not try to stop them, replace them. The cue and the craving will still happen. Route the response toward something healthier that satisfies the same underlying craving.

What habit are you trying to build or break? Tell me the specific one and I will help you design the exact system.`
  },
  'How will AI agents change work?': {
    practical: `🤖 AI AGENTS + YOUR WORK — ACTION PLAN

━━ WHAT AI AGENTS ARE DOING RIGHT NOW ━━
✓ Research synthesis: replacing hours of manual information gathering
✓ First-draft generation: emails, reports, code, summaries, analysis
✓ Routine scheduling and coordination — calendar management, follow-ups
✓ Data pattern identification — finding what humans would miss in large datasets
✓ Answering repetitive questions — internal and customer-facing

━━ BUILD THESE SKILLS THIS MONTH ━━
✓ Prompt engineering — learn to give AI precise, effective multi-step instructions
✓ Workflow design — stop thinking in individual tasks, think in automated systems
✓ Output evaluation — spot AI errors, hallucinations, missing context
✓ Tool fluency — use Claude, GPT-4, Cursor, Perplexity, Zapier AI actively daily

━━ YOUR AI WORKFLOW (start this week) ━━
① Any first draft (email, doc, plan) → AI generates → you refine + add judgment
② Any research task → AI synthesizes background → you verify key facts + add insight
③ Any repetitive process → explore automating via Make.com or Zapier
④ Any complex decision → use AI as devil's advocate to stress-test your reasoning

━━ HOW TO STAY IRREPLACEABLE ━━
✓ Deep domain expertise + AI fluency = rare and extremely valuable combination
✓ Genuine relationships and trust — AI cannot replicate authentic human connection
✓ Creative vision and taste — directing what "good" looks like is a human function
✓ Ethical accountability — someone has to own the outcomes, forever`,
    conversational: `AI agents are genuinely one of the biggest shifts in how knowledge work gets done — possibly in decades — and understanding what is actually happening gives you a massive advantage over people who are either panicking or ignoring it.

Here is what I mean by "agent": unlike chatGPT answering a question, an AI agent is given a goal and figures out and executes the steps to achieve it. You say "research our three main competitors and draft a comparison report" and it browses websites, collects information, synthesizes it, writes the draft, and formats it — the whole chain, autonomously.

This changes the nature of work from "doing tasks" to "directing agents and judging outputs." Your job becomes setting the right goals, providing the right context, and evaluating whether the result is actually good.

The skills that become more valuable: judgment, taste, ethical reasoning, genuine relationship-building, creative vision, and the ability to evaluate AI outputs critically. These are things AI is genuinely bad at right now.

The skills that become less valuable: information retrieval, routine drafting, data formatting, template-based analysis. If your job is primarily these things — and many jobs are — the honest advice is to start building other skills now, not to wait.

But here is what most people miss: the biggest opportunity is in people who combine strong domain expertise with AI fluency. The AI + healthcare professional, the AI + lawyer, the AI + financial analyst — these combinations are incredibly rare right now and disproportionately valuable. Companies are desperate for people who understand both worlds.

The move to make today: pick one time-consuming task in your work and try using AI to produce the first version of it. Even if the result is imperfect, you will learn something important about what AI can and cannot do in your specific context.

What is your current role? I can give you a much more specific picture of what this means for you personally.`
  },
  'How to stop procrastinating?': {
    practical: `🧠 BEAT PROCRASTINATION — SCIENCE-BACKED TACTICS

THE ROOT CAUSE: Procrastination is emotional avoidance, not laziness.
You are not avoiding the task — you are avoiding the FEELING the task creates.

━━ TACTICAL TOOLS ━━

THE 5-MINUTE COMMITMENT:
✓ Tell yourself: "I will work on this for just 5 minutes"
✓ Set a real timer. Give yourself full permission to stop at 5 minutes.
✓ You almost never stop — because starting was the only obstacle.
✓ Works because procrastination is about the START, not the task itself.

THE 2-MINUTE RULE:
✓ Any task under 2 minutes → do it immediately, not later
✓ Removes accumulation of small undone tasks that create mental drag and guilt

IMPLEMENTATION INTENTIONS (proven to increase follow-through 2-3x):
❌ "I will work on my report this week"
✅ "I will work on my report at 9am Tuesday in my home office for 60 minutes"
The specificity of WHEN + WHERE + WHAT is the key.

SHRINK THE TASK:
❌ "Write the proposal" → paralyzing
✅ "Write the opening sentence of the proposal" → startable
Make the next action so small it feels almost silly NOT to do it.

COMMITMENT DEVICES:
✓ Tell someone your deadline — social accountability outperforms self-discipline
✓ Pay a friend $50 if you do not finish by Thursday
✓ Book a focused work session at a library (leaving = social shame)`,
    conversational: `Procrastination is almost never about laziness. Once you understand what it actually is, the whole thing makes much more sense — and the solutions become obvious.

You are not avoiding the task. You are avoiding the FEELING associated with the task. The fear of doing it badly. The overwhelming vagueness of not knowing where to start. The discomfort of working on something that does not feel natural yet. The anxiety of potential judgment.

This is why "just do it" is useless advice. Willpower battles are losing battles against a threat response. The real fix is reducing the emotional cost of starting.

The tool I come back to constantly: the 5-minute commitment. Tell yourself you will work on the dreaded thing for exactly 5 minutes. Set a real timer. Give yourself complete permission to stop at 5 if you want. Almost nobody stops at 5. Because starting was the only obstacle — once you actually begin, the emotional resistance drops off sharply. The brain stops treating the task as a threat and starts treating it as just a thing you are doing.

The second insight: procrastination grows when tasks are vague. "Work on the project" is paralyzing because your brain does not know where to aim. "Write the first bullet point of the outline" is concrete and startable. Make every next action so small and specific that not doing it feels almost silly.

Implementation intentions are magic for this: research shows that saying "I will do X at Y time in Z location" increases follow-through by 2-3x compared to just saying "I will do X this week." The specificity converts intention into action automatically.

And if all else fails: tell someone what you are going to do and when. Most people will work harder to avoid mild social embarrassment than they will for any abstract goal. Accountability is a cheat code.

What specific task are you avoiding right now? Tell me and let us figure out exactly what is creating the resistance.`
  },
  'Building unshakeable confidence': {
    practical: `💪 BUILD REAL CONFIDENCE — EVIDENCE-BASED SYSTEM

━━ WEEK 1: BUILD YOUR EVIDENCE BASE ━━
✓ Write 10 REAL achievements — anything hard you have done or survived
✓ List 5 difficult situations you navigated successfully
✓ Ask 3 people who know you well: "What do you think I am genuinely good at?"
✓ This list is your anchor — read it every morning for 2 weeks

━━ DAILY MICRO-COURAGE PRACTICE ━━
✓ Do ONE uncomfortable thing per day (start tiny — speak up in a meeting, introduce yourself)
✓ Speak first in group settings at least once daily
✓ Give your opinion before asking others for theirs
✓ Make direct eye contact and hold it 1-2 seconds longer than feels natural

━━ BODY LANGUAGE THAT CREATES CONFIDENCE ━━
✓ Shoulders back, take up your full physical space — stop making yourself smaller
✓ Slow your speaking pace slightly — speed signals nervousness
✓ Let pauses breathe without rushing to fill silence
✓ Walk at a deliberate pace — not hurried, not slow

━━ BUILD ACTUAL COMPETENCE ━━
✓ Pick ONE skill, practice it until you are genuinely good
✓ Competence creates authentic confidence — there is no shortcut
✓ Track visible progress — seeing improvement is its own motivation

━━ WHEN IMPOSTER THOUGHTS HIT ━━
✓ Do not try to FEEL confident — just ACT as a confident version of you would act
✓ Ask: "Is this thought based on evidence, or just a feeling?"
✓ Remember: the feeling of not belonging is experienced by 70% of high achievers`,
    conversational: `Real confidence is not something you get before doing scary things — it is something you build BY doing them. That one reframe changes everything about how to approach it.

The popular advice is "just believe in yourself!" This is almost completely useless. You cannot will yourself into believing something your own experience has not given you evidence for. What you CAN do is take small actions, create real evidence from those actions, and let that evidence slowly build genuine belief over time.

Here is the cycle: small uncomfortable action → you survive it, maybe even do okay → now you have real evidence you can handle this → slightly bigger action → more evidence → actual confidence. Slow, unglamorous, but the only kind that actually holds up under pressure.

The practical version: daily micro-bravery. Not big dramatic gestures — just tiny uncomfortable things every single day. Speak up when you would normally stay quiet. Share an opinion you usually keep private. Introduce yourself to someone you would normally avoid. Each of these is a small act of courage. Each one adds a data point to your evidence file.

Something counterintuitive that actually works: the body and mind connection runs both ways. Your brain monitors your body posture to assess confidence level. Standing tall, taking up space, speaking slowly — these behaviors send signals to your brain that you are safe and in control. Which then makes you actually feel more confident. The body leads, and the mind follows.

And for imposter syndrome — which nearly every high achiever experiences at some level — the most useful question is not "do I deserve to be here?" but "would a confident version of me still take this action?" And then just do the action, feeling whatever you feel.

What specific situation do you want to feel more confident in? The approach shifts quite a bit depending on whether it is career, social, public speaking, or something else.`
  },
  'How to negotiate a better salary?': {
    practical: `💰 SALARY NEGOTIATION PLAYBOOK

━━ BEFORE THE CONVERSATION ━━
✓ Research: Glassdoor + Levels.fyi + LinkedIn Salary + Payscale — use all four
✓ Write down 5 achievements with NUMBERS (saved $X, grew metric by Y%, shipped Z)
✓ Set your target (market rate + 15-20%) and your walk-away number
✓ Rehearse out loud — hearing yourself say a higher number reduces anxiety

━━ THE NEGOTIATION ITSELF ━━
① Let them offer first: "What is the budgeted range for this role?"
② After their number: pause 5 full seconds in silence before responding
③ Counter 15-20% above their offer with a concrete justification:
   "Based on my research and the $200k in cost savings I drove last year, I was expecting $95k"
④ Anchor with specifics — "$95,000" beats "$90-100k" every time

━━ WHEN THEY SAY THE NUMBER IS FIRM ━━
✓ "Is there flexibility on the signing bonus?"
✓ "Could we build in a 6-month performance review with a target raise?"
✓ "What about additional PTO or remote flexibility?"
✓ Base salary is not the only thing negotiable

━━ GOLDEN RULES ━━
✓ NEVER accept on the spot — always: "Let me review this by tomorrow"
✓ Get every agreed term in writing before signing
✓ Negotiate EVERY offer — companies budget for it, they expect it
✓ They will virtually never rescind an offer because you asked politely`,
    conversational: `This is my favorite topic because most people are literally leaving thousands of dollars per year on the table — and it takes one conversation to fix.

The mindset shift that changes everything: companies budget for negotiation. HR literally plans for candidates to counter. Not negotiating actually signals low confidence to many hiring managers. You are not being demanding — you are behaving professionally.

Here is what actually works:

Let them talk first. When an offer is made, ask "What is the budgeted range for this role?" before revealing any number. You want their anchor, not the other way around.

Then: silence. After they give a number, wait 5 full, quiet seconds before responding. It is deeply uncomfortable. But people rush to fill silence and often improve their own offer before you say a single word.

Counter higher than you want. Ask for 15-20% above their offer. They will meet you somewhere in the middle, and that middle is exactly where you wanted to land. The math is simple: if you ask for what you want, you get less than what you want.

Justify with value, not need. "I need more for my rent" is weak. "Based on my market research and the $150k pipeline I managed last year, I was expecting $X" is powerful. Frame your worth in their terms, not yours.

Never accept on the spot. No matter how exciting the offer, say: "This is exciting — let me review everything carefully and get back to you by tomorrow." That 24 hours costs you nothing and gives you leverage.

One real example: a friend was offered $90k. She countered with $107k using specific performance data. They met at $98k + $6k signing bonus. That is $14k more for one 10-minute conversation.

Worst case: they say no. They almost never do. And they definitely do not rescind the offer because you asked professionally.

What were you offered, and what do you think you are worth? Let me help you think through the specific counter.`
  },
  'How to validate a startup idea?': {
    practical: `🚀 VALIDATE YOUR IDEA IN 14 DAYS

━━ DAYS 1-7: VALIDATE THE PROBLEM ━━
① Write down your single riskiest assumption ("People will pay for X")
② Identify 20 potential customers — NOT friends/family, actual target users
③ Run 15-20 conversations using ONLY this script:
   "Tell me about the last time you experienced [the problem]."
④ Listen. Do NOT pitch your solution yet.

GREEN LIGHTS ✓:
• They describe the problem in detailed, emotional terms
• They mention what they currently use to solve it (and complain about it)
• They say "I would pay for that" before you ask

RED FLAGS ✗:
• "That sounds interesting / cool" — polite but meaningless
• Only your friends are excited
• They cannot recall a specific recent instance of the problem

━━ DAYS 8-14: VALIDATE THE SOLUTION ━━
① Build a landing page in 2-3 hours (Carrd.co — zero code needed)
② Describe your solution clearly + add a "Join Waitlist" or "Pre-Order" button
③ Drive 100+ visitors from: Reddit threads, LinkedIn posts, $50 Facebook ads
④ Benchmarks:
   • 20%+ signup rate → promising signal
   • 40%+ signup rate → strong signal
   • 3+ people pre-pay any amount → REAL validation

⚡ ULTIMATE TEST: Can you get someone to pay BEFORE you build anything?
Even $1 of pre-payment beats 1,000 "that sounds interesting" responses.`,
    conversational: `Validating before building is the single highest-leverage thing you can do as a founder. Most first-time founders skip it and spend 6-12 months building something nobody actually wants. Let me walk you through what actually works.

The core philosophy: fall in love with the PROBLEM, not your solution. Your solution will change many times. The problem is what you are really building a business around. And the only way to know if the problem is real and painful enough is to talk to actual humans who should have it.

The magic interview script: ask this before showing anyone your idea — "Tell me about the last time you experienced [the problem you are solving]." That is it. No pitch, no explanation, just pure listening.

If they say "hmm, I cannot really remember a specific time" → the problem might not be painful enough.
If they light up and tell you a detailed story about how frustrating it is and what they have tried → you are onto something real.

Run 15-20 of these conversations with people who are GENUINELY your target customer. Not your friends, not your family — people who would actually need to buy this. This is uncomfortable and takes effort. That is the whole point.

Then the smoke test: build a simple landing page (Carrd.co takes two hours, no code). Describe your solution clearly and add a waitlist or pre-order button. Bring some traffic to it — post in relevant subreddits, LinkedIn, or run $50 in Facebook ads. If 20%+ of visitors sign up, that is a real market signal.

If you can get anyone to actually pay before you build anything — even $5 — that is worth more than 500 "love this idea!" responses from people who are being polite.

Uncomfortable truth: most startup ideas do not survive honest validation. And discovering this in week two is the BEST thing that can happen to you — it is infinitely better than month twelve.

Tell me your idea — I love helping people design specific validation experiments.`
  },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function AIGrow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('paths');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [showXPNotif, setShowXPNotif] = useState(false);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingText, setTypingText] = useState('');
  const [typingFull, setTypingFull] = useState('');
  const [typingDone, setTypingDone] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = localStorage.getItem('aigrow_profile');
    const sm = localStorage.getItem('aigrow_messages');
    if (sp) {
      try {
        const p: UserProfile = JSON.parse(sp);
        const lastVisit = p.lastVisit ? new Date(p.lastVisit) : null;
        const now = new Date();
        if (lastVisit) {
          const daysDiff = Math.floor((now.getTime() - lastVisit.getTime()) / 86400000);
          if (daysDiff === 1) p.streak = (p.streak || 0) + 1;
          else if (daysDiff > 1) p.streak = 1;
        }
        p.lastVisit = now.toISOString();
        setUserProfile(p);
        localStorage.setItem('aigrow_profile', JSON.stringify(p));
        setShowSetup(false);
      } catch { /* ignore */ }
    }
    if (sm) {
      try {
        const msgs = JSON.parse(sm).map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(msgs);
        if (msgs.length > 0) setActiveTab('chat');
      } catch { /* ignore */ }
    }
  }, []);

  // Save messages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (messages.length > 0) {
      localStorage.setItem('aigrow_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  // Typewriter effect
  useEffect(() => {
    if (!typingFull || typingDone) return;
    let i = typingText.length;
    const interval = setInterval(() => {
      if (i >= typingFull.length) {
        setTypingDone(true);
        clearInterval(interval);
        return;
      }
      setTypingText(typingFull.slice(0, i + 1));
      i++;
    }, 8);
    return () => clearInterval(interval);
  }, [typingFull, typingDone, typingText]);

  const checkAchievements = useCallback((profile: UserProfile) => {
    const earned = ACHIEVEMENTS.filter(a => !profile.achievements.includes(a.id) && a.trigger(profile));
    if (earned.length > 0) {
      const updated = { ...profile, achievements: [...profile.achievements, ...earned.map(a => a.id)] };
      setUserProfile(updated);
      localStorage.setItem('aigrow_profile', JSON.stringify(updated));
      setNewAchievement(earned[0].label);
      setTimeout(() => setNewAchievement(null), 3500);
    }
  }, []);

  const getPersonalizedResponse = (question: string, profile: UserProfile | null): string => {
    const style = profile?.learningStyle ?? 'conversational';
    if (predefinedAnswers[question]) {
      return predefinedAnswers[question][style] ?? predefinedAnswers[question][Object.keys(predefinedAnswers[question])[0]];
    }
    const fallbacks: Record<string, string> = {
      practical: `🎯 PRACTICAL GUIDE: ${question}\n\nHere is a structured action plan:\n\n✓ Research the fundamentals through reputable sources and documentation\n✓ Find 2-3 real examples of people who have successfully tackled this\n✓ Break it into the smallest possible first step and take that step TODAY\n✓ Build a feedback loop — track what works and what does not\n✓ Connect with others who have done this — communities accelerate learning significantly\n\nThe key insight: start before you feel ready. Readiness comes from doing, not from preparing to do.`,
      conversational: `Great question! "${question}" is something I have thought about a lot.\n\nHere is my honest take: the answer depends heavily on your specific context, but the core principles are usually simpler than they seem.\n\nThe most important thing is to start with a clear understanding of WHY this matters to you — the strongest motivation comes from connecting the answer to something genuinely meaningful in your own life.\n\nFrom there, find people who have already done what you are trying to do and study their path. Most are more accessible than you think.\n\nWhat is the specific context that brought up this question? That would help me give you much more targeted advice.`,
      visual: `📊 VISUAL FRAMEWORK: ${question}\n\nThink of it as three interconnected layers:\n\nLayer 1 — FOUNDATION: The core concepts and principles that everything else builds on\nLayer 2 — APPLICATION: How those principles translate into real-world actions\nLayer 3 — MASTERY: The nuances and edge cases that differentiate good from great\n\nThe most important visual: map out where you are now and where you want to be. The gap IS your action plan. Every step that reduces that gap is progress.`,
      theoretical: `📚 CONCEPTUAL DEEP DIVE: ${question}\n\nAt its core, this question touches on several interrelated principles:\n\nFirst, understand the underlying mechanisms — not just what works but WHY it works. This generative understanding lets you adapt to novel situations.\n\nSecond, explore the historical context — how did current best practices evolve? What replaced what? What was tried and failed?\n\nThird, examine the edge cases and exceptions — these reveal the boundaries of any model and sharpen your overall understanding.\n\nRecommended frameworks to explore: systems thinking, first principles reasoning, and feedback loop analysis all apply well here.`
    };
    return fallbacks[style] ?? fallbacks.conversational;
  };

  const sendMessage = (question: string, category?: string) => {
    if (!question.trim()) return;

    const userMsg: Message = {
      role: 'user', text: question.trim(),
      timestamp: new Date(), id: `u-${Date.now()}`, category,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setActiveTab('chat');

    setTimeout(() => {
      const answer = getPersonalizedResponse(question.trim(), userProfile);
      const aiMsg: Message = {
        role: 'ai', text: answer,
        timestamp: new Date(), id: `a-${Date.now()}`, category,
        tokens: Math.floor(answer.length / 4),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      // Start typewriter for last message
      setTypingText('');
      setTypingFull(answer);
      setTypingDone(false);

      if (userProfile) {
        const updated: UserProfile = {
          ...userProfile,
          totalChats: userProfile.totalChats + 1,
          xp: userProfile.xp + XP_PER_CHAT,
          level: getLevelInfo(userProfile.xp + XP_PER_CHAT).level,
          lastVisit: new Date().toISOString(),
        };
        setUserProfile(updated);
        localStorage.setItem('aigrow_profile', JSON.stringify(updated));
        setShowXPNotif(true);
        setTimeout(() => setShowXPNotif(false), 2000);
        checkAchievements(updated);
      }
    }, 900 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const addReaction = (id: string, r: Message['reaction']) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, reaction: m.reaction === r ? undefined : r } : m));
  };

  const filteredPaths = learningPaths.map(p => ({
    ...p,
    questions: searchQuery
      ? p.questions.filter(q => q.toLowerCase().includes(searchQuery.toLowerCase()))
      : p.questions,
  })).filter(p => !searchQuery || p.questions.length > 0);

  if (showSetup) {
    return <SetupScreen onComplete={(profile) => {
      setUserProfile(profile);
      localStorage.setItem('aigrow_profile', JSON.stringify(profile));
      setShowSetup(false);
    }} onSkip={() => setShowSetup(false)} />;
  }

  const levelInfo = userProfile ? getLevelInfo(userProfile.xp) : null;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh', background: '#0c0e14', color: '#e8eaf0', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background mesh */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* XP Notification */}
      {showXPNotif && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 100, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', boxShadow: '0 8px 32px rgba(99,102,241,0.4)', animation: 'slideInRight 0.3s ease' }}>
          +{XP_PER_CHAT} XP ✨
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: 'linear-gradient(135deg, #f59e0b, #f97316)', padding: '12px 24px', borderRadius: 16, fontSize: 14, fontWeight: 700, color: '#fff', boxShadow: '0 8px 32px rgba(245,158,11,0.5)', whiteSpace: 'nowrap' }}>
          🏆 Achievement Unlocked: {newAchievement}
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(12,14,20,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #a5b4fc, #f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI GROW</div>
            {userProfile && <div style={{ fontSize: 11, color: '#6b7280', marginTop: -2 }}>{userProfile.name} · {levelInfo?.name}</div>}
          </div>
        </div>

        {userProfile && levelInfo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#f97316', fontWeight: 700 }}>🔥 {userProfile.streak}d</span>
              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 700 }}>Lv.{levelInfo.level} {levelInfo.name}</span>
            </div>
            <div style={{ width: 80, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ width: `${levelInfo.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 3, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 0, background: 'rgba(12,14,20,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 64, zIndex: 40 }}>
        {(['paths', 'chat', 'progress', 'settings'] as Tab[]).map(tab => {
          const icons: Record<Tab, string> = { paths: '🗺️', chat: '💬', progress: '📊', settings: '⚙️' };
          const labels: Record<Tab, string> = { paths: 'Explore', chat: 'Chat', progress: 'Progress', settings: 'Profile' };
          const isActive = activeTab === tab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '12px 8px', background: 'none', border: 'none', color: isActive ? '#a5b4fc' : '#6b7280', fontSize: 12, fontWeight: isActive ? 700 : 400, cursor: 'pointer', borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'color 0.2s', fontFamily: 'inherit' }}>
              <span style={{ fontSize: 16 }}>{icons[tab]}</span>
              <span>{labels[tab]}</span>
              {tab === 'chat' && messages.length > 0 && (
                <span style={{ position: 'absolute', top: 8, background: '#6366f1', color: '#fff', borderRadius: 10, padding: '1px 5px', fontSize: 9, fontWeight: 800 }}>{messages.filter(m => m.role === 'user').length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>

        {/* ── EXPLORE TAB ── */}
        {activeTab === 'paths' && (
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                {userProfile ? `What are you learning today, ${userProfile.name}?` : 'Choose Your Learning Path'}
              </h2>
              <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
                {userProfile ? `${userProfile.learningStyle.charAt(0).toUpperCase() + userProfile.learningStyle.slice(1)} learner · ${userProfile.skillLevel} level · ${userProfile.xp} XP earned` : 'Select a category below to get started'}
              </p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 16 }}>🔍</span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search questions across all topics..."
                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#e8eaf0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {/* Category cards */}
            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {filteredPaths.map((path, idx) => {
                const isOpen = activePath === idx;
                return (
                  <div key={idx} style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px rgba(${path.accent.replace('#','').match(/.{2}/g)?.map(h => parseInt(h,16)).join(',') ?? '0,0,0'},0.15)`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>
                    <button onClick={() => setActivePath(isOpen ? null : idx)} style={{ width: '100%', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(135deg, ${path.accent}33, ${path.accent}22)`, border: `1px solid ${path.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                        {path.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#e8eaf0', marginBottom: 3 }}>{path.category}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>{path.description}</div>
                      </div>
                      <span style={{ color: '#6b7280', fontSize: 18, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {path.questions.map((q, i) => (
                            <button key={i} onClick={() => sendMessage(q, path.category)}
                              style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.07)`, color: '#c4c7d4', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', lineHeight: 1.4 }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${path.accent}22`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${path.accent}55`; (e.currentTarget as HTMLButtonElement).style.color = '#e8eaf0'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = '#c4c7d4'; }}>
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredPaths.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No results found</div>
                <div style={{ fontSize: 14 }}>Try a different search term</div>
              </div>
            )}
          </div>
        )}

        {/* ── CHAT TAB ── */}
        {activeTab === 'chat' && (
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 'calc(100vh - 240px)' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#e8eaf0', marginBottom: 8 }}>Start a conversation</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>Ask anything, or explore the topics in the <button onClick={() => setActiveTab('paths')} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, textDecoration: 'underline' }}>Explore tab</button></div>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1;
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: 12, alignItems: 'flex-start', animation: 'fadeUp 0.3s ease' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: isUser ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #1e2130, #252840)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                    {isUser ? '👤' : '🧠'}
                  </div>
                  <div style={{ maxWidth: '78%' }}>
                    {msg.category && !isUser && (
                      <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{msg.category}</div>
                    )}
                    <div style={{ padding: '14px 18px', borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px', background: isUser ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.05)', border: isUser ? 'none' : '1px solid rgba(255,255,255,0.07)', fontSize: 14, lineHeight: 1.7, color: isUser ? '#fff' : '#d4d8e8', whiteSpace: 'pre-wrap' }}>
                      {isLast && !isUser && !typingDone ? typingText : msg.text}
                      {isLast && !isUser && !typingDone && <span style={{ display: 'inline-block', width: 2, height: 14, background: '#6366f1', animation: 'blink 1s infinite', marginLeft: 2, verticalAlign: 'text-bottom' }} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                      <span style={{ fontSize: 10, color: '#4b5563' }}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.tokens && <span style={{ fontSize: 10, color: '#374151' }}>~{msg.tokens} tokens</span>}
                      {!isUser && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {(['👍', '💡', '🔥', '📌'] as const).map(r => (
                            <button key={r} onClick={() => addReaction(msg.id, r)}
                              style={{ background: msg.reaction === r ? 'rgba(99,102,241,0.2)' : 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: '2px 5px', borderRadius: 6, opacity: msg.reaction && msg.reaction !== r ? 0.3 : 1, transition: 'all 0.15s' }}>
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', animation: 'fadeUp 0.3s ease' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1e2130, #252840)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🧠</div>
                <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}

        {/* ── PROGRESS TAB ── */}
        {activeTab === 'progress' && (
          <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
            {!userProfile ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Set up your profile to track progress</div>
              </div>
            ) : (
              <>
                {/* Level card */}
                {levelInfo && (
                  <div style={{ borderRadius: 20, background: 'linear-gradient(135deg, #1a1c2e, #1e1f35)', border: '1px solid rgba(99,102,241,0.3)', padding: 24, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>CURRENT LEVEL</div>
                        <div style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #a5b4fc, #f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{levelInfo.name}</div>
                        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Level {levelInfo.level} · {userProfile.xp} XP total</div>
                      </div>
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                        {['🌱','🌿','📖','🗺️','💭','🎯','🔮','⚡','🏆','👑'][levelInfo.level]}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                      {levelInfo.xpToNext > 0 ? `${levelInfo.xpToNext} XP to next level` : 'Maximum level reached!'}
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${levelInfo.progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 4, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                )}

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  {[
                    { label: 'Conversations', value: userProfile.totalChats, icon: '💬', color: '#6366f1' },
                    { label: 'Day Streak', value: `${userProfile.streak}🔥`, icon: '🔥', color: '#f97316' },
                    { label: 'Total XP', value: userProfile.xp, icon: '⚡', color: '#10b981' },
                    { label: 'Achievements', value: `${userProfile.achievements.length}/${ACHIEVEMENTS.length}`, icon: '🏆', color: '#f59e0b' },
                  ].map((s, i) => (
                    <div key={i} style={{ borderRadius: 16, padding: '18px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Achievements */}
                <div style={{ borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏆 Achievements</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {ACHIEVEMENTS.map(a => {
                      const earned = userProfile.achievements.includes(a.id);
                      return (
                        <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: earned ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${earned ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)'}`, opacity: earned ? 1 : 0.5 }}>
                          <span style={{ fontSize: 20 }}>{earned ? a.label.split(' ')[0] : '🔒'}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: earned ? '#e8eaf0' : '#6b7280' }}>{a.label.split(' ').slice(1).join(' ')}</div>
                            <div style={{ fontSize: 11, color: '#4b5563' }}>{a.desc}</div>
                          </div>
                          {earned && <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
            {userProfile ? (
              <>
                <div style={{ borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: 24, marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>👤 Your Profile</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'Name', value: userProfile.name },
                      { label: 'Learning Style', value: userProfile.learningStyle.charAt(0).toUpperCase() + userProfile.learningStyle.slice(1) },
                      { label: 'Skill Level', value: userProfile.skillLevel.charAt(0).toUpperCase() + userProfile.skillLevel.slice(1) },
                      { label: 'Interests', value: userProfile.interests.join(', ') },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
                        <span style={{ fontSize: 13, color: '#e8eaf0', fontWeight: 500 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button onClick={() => { setMessages([]); localStorage.removeItem('aigrow_messages'); }} style={{ padding: '14px 20px', borderRadius: 14, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                    🗑️ Clear Chat History
                  </button>
                  <button onClick={() => { localStorage.clear(); setUserProfile(null); setMessages([]); setShowSetup(true); }} style={{ padding: '14px 20px', borderRadius: 14, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                    🔄 Reset All Data & Start Over
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <button onClick={() => setShowSetup(true)} style={{ padding: '16px 32px', borderRadius: 16, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Set Up Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar (always visible on chat tab) */}
      {activeTab === 'chat' && (
        <div style={{ position: 'sticky', bottom: 0, background: 'rgba(12,14,20,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px', zIndex: 40 }}>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'; }}
              onKeyDown={handleKeyDown}
              placeholder={userProfile ? `Ask anything, ${userProfile.name}… (Enter to send, Shift+Enter for new line)` : 'Ask anything…'}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#e8eaf0', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, transition: 'border-color 0.2s', minHeight: 46 }}
              onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
              style={{ width: 46, height: 46, borderRadius: 12, background: input.trim() && !isTyping ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', fontSize: 18, cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
              {isTyping ? '⏳' : '↑'}
            </button>
          </div>
          <div style={{ maxWidth: 760, margin: '6px auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#374151' }}>Powered by AI GROW · Adapts to your {userProfile?.learningStyle ?? 'learning'} style</span>
            {messages.length > 0 && (
              <button onClick={() => { setMessages([]); localStorage.removeItem('aigrow_messages'); }}
                style={{ fontSize: 11, color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
                Clear chat
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-6px); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes slideInRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        * { scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.3) transparent; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}

// ─── SETUP SCREEN ─────────────────────────────────────────────────────────────

function SetupScreen({
  onComplete, onSkip
}: {
  onComplete: (p: UserProfile) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [style, setStyle] = useState<UserProfile['learningStyle']>('conversational');
  const [level, setLevel] = useState<UserProfile['skillLevel']>('beginner');
  const [interests, setInterests] = useState<string[]>([]);

  const allInterests = ['Career Growth', 'AI & Tech', 'Entrepreneurship', 'Personal Development', 'Productivity', 'Finance', 'Health & Fitness', 'Creative Skills', 'Leadership'];

  const complete = () => {
    const p: UserProfile = {
      name: name || 'Learner', learningStyle: style, skillLevel: level, interests,
      streak: 1, totalChats: 0, xp: 0, level: 0, achievements: [],
      lastVisit: new Date().toISOString(),
    };
    onComplete(p);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0c0e14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 480, width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>🧠</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #a5b4fc, #f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px', letterSpacing: '-1px' }}>Welcome to AI GROW</h1>
          <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>Your AI adapts to how YOU learn best</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ width: s === step ? 32 : 8, height: 8, borderRadius: 4, background: s <= step ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }} />
          ))}
        </div>

        <div style={{ borderRadius: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: 32 }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8eaf0', marginBottom: 6 }}>What should I call you?</h2>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>I will personalize everything to you.</p>
              <input
                autoFocus type="text" value={name} placeholder="Your first name"
                onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && name && setStep(2)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#e8eaf0', fontSize: 16, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 20 }}
              />
              <button onClick={() => setStep(2)} disabled={!name}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: name ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)', border: 'none', color: name ? '#fff' : '#4b5563', fontSize: 15, fontWeight: 700, cursor: name ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8eaf0', marginBottom: 6 }}>How do you learn best?</h2>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>I will adapt every answer to your style.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  { v: 'conversational', e: '💬', l: 'Conversational', d: 'Stories & dialogue' },
                  { v: 'practical', e: '🎯', l: 'Practical', d: 'Step-by-step action' },
                  { v: 'theoretical', e: '📚', l: 'Theoretical', d: 'Deep concepts' },
                  { v: 'visual', e: '📊', l: 'Visual', d: 'Frameworks & charts' },
                ].map(s => (
                  <button key={s.v} onClick={() => setStyle(s.v as UserProfile['learningStyle'])}
                    style={{ padding: '14px 12px', borderRadius: 14, border: `1.5px solid ${style === s.v ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, background: style === s.v ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{s.e}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: style === s.v ? '#a5b4fc' : '#e8eaf0' }}>{s.l}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{s.d}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(3)} style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Continue →</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8eaf0', marginBottom: 6 }}>Your experience level?</h2>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>No right answer — be honest for the best results.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[
                  { v: 'beginner', e: '🌱', l: 'Beginner', d: 'Just starting to explore these topics' },
                  { v: 'intermediate', e: '🚀', l: 'Intermediate', d: 'Have some experience and context' },
                  { v: 'advanced', e: '⚡', l: 'Advanced', d: 'Deep knowledge, want nuanced insights' },
                ].map(l => (
                  <button key={l.v} onClick={() => setLevel(l.v as UserProfile['skillLevel'])}
                    style={{ padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${level === l.v ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, background: level === l.v ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 24 }}>{l.e}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: level === l.v ? '#a5b4fc' : '#e8eaf0' }}>{l.l}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{l.d}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(4)} style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Continue →</button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8eaf0', marginBottom: 6 }}>What interests you most?</h2>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Pick 2-3 topics you want to grow in.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                {allInterests.map(t => {
                  const sel = interests.includes(t);
                  return (
                    <button key={t} onClick={() => sel ? setInterests(interests.filter(x => x !== t)) : interests.length < 3 && setInterests([...interests, t])}
                      style={{ padding: '10px 8px', borderRadius: 12, border: `1.5px solid ${sel ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, background: sel ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', color: sel ? '#a5b4fc' : '#9ca3af', fontSize: 11, fontWeight: sel ? 700 : 400, cursor: interests.length >= 3 && !sel ? 'not-allowed' : 'pointer', fontFamily: 'inherit', textAlign: 'center', lineHeight: 1.3, transition: 'all 0.2s', opacity: interests.length >= 3 && !sel ? 0.4 : 1 }}>
                      {t}
                    </button>
                  );
                })}
              </div>
              <button onClick={complete} disabled={interests.length === 0}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: interests.length > 0 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)', border: 'none', color: interests.length > 0 ? '#fff' : '#4b5563', fontSize: 15, fontWeight: 700, cursor: interests.length > 0 ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                Start Learning 🚀
              </button>
            </div>
          )}

          <button onClick={onSkip} style={{ width: '100%', padding: '10px', marginTop: 12, background: 'none', border: 'none', color: '#4b5563', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Skip setup and explore
          </button>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');`}</style>
    </div>
  );
}
