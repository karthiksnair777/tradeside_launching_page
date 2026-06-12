export type QuestionType = 'single' | 'multi' | 'scale';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export const assessmentSections: Section[] = [
  {
    id: "profile",
    title: "Trader Profile",
    questions: [
      { id: "p1", text: "How long have you been trading?", type: "single", options: ["< 6 months", "6-12 months", "1-3 years", "3+ years"] },
      { id: "p2", text: "Which markets do you trade?", type: "multi", options: ["Forex", "Gold", "Crypto", "Indices", "Stocks"] },
      { id: "p3", text: "What timeframe do you mostly trade?", type: "single", options: ["Scalping (1m-5m)", "Day Trading (15m-1H)", "Swing Trading (4H-Daily)"] },
      { id: "p4", text: "How many trades do you take weekly?", type: "single", options: ["1-3", "4-10", "11-20", "20+"] },
      { id: "p5", text: "Have you ever been profitable for 3+ consecutive months?", type: "single", options: ["Yes", "No", "Not sure"] },
    ]
  },
  {
    id: "psychology",
    title: "Psychology Assessment",
    questions: [
      { id: "ps1", text: "I feel anxious before entering trades", type: "scale" },
      { id: "ps2", text: "I move my stop loss frequently", type: "scale" },
      { id: "ps3", text: "I revenge trade after losses", type: "scale" },
      { id: "ps4", text: "I feel fear when entering valid setups", type: "scale" },
      { id: "ps5", text: "I close winners too early", type: "scale" },
      { id: "ps6", text: "I hold losers hoping they reverse", type: "scale" },
      { id: "ps7", text: "I feel FOMO when I miss a trade", type: "scale" },
      { id: "ps8", text: "I struggle to stay patient", type: "scale" },
      { id: "ps9", text: "I overtrade during emotional periods", type: "scale" },
      { id: "ps10", text: "I depend on trading profits emotionally", type: "scale" },
    ]
  },
  {
    id: "risk",
    title: "Risk Management",
    questions: [
      { id: "r1", text: "What percentage do you risk per trade?", type: "single", options: ["< 1%", "1-2%", "3-5%", "5%+"] },
      { id: "r2", text: "Do you use stop losses?", type: "single", options: ["Always", "Sometimes", "Never", "Mental Stops"] },
      { id: "r3", text: "Have you blown an account before?", type: "single", options: ["Never", "1-2 times", "3-5 times", "Lost count"] },
      { id: "r4", text: "How many losses in a row can you tolerate before changing strategy?", type: "single", options: ["1-2", "3-5", "5+", "I immediately change strategy"] },
      { id: "r5", text: "Do you have predefined daily/weekly risk limits?", type: "single", options: ["Yes, and I follow them", "Yes, but I break them", "No"] },
    ]
  },
  {
    id: "discipline",
    title: "Discipline & Execution",
    questions: [
      { id: "d1", text: "Do you have a written trading plan?", type: "single", options: ["Yes, detailed", "A basic one", "In my head", "No"] },
      { id: "d2", text: "Do you maintain a journal?", type: "single", options: ["Daily", "Sometimes", "Only when winning", "Never"] },
      { id: "d3", text: "How often do you break your entry rules?", type: "single", options: ["Rarely", "1-2 times a week", "Almost daily"] },
      { id: "d4", text: "Do you enter trades without full confirmation?", type: "single", options: ["Never", "Sometimes", "Often due to FOMO"] },
      { id: "d5", text: "Do you follow your trading system consistently?", type: "single", options: ["100% of the time", "Most of the time", "I jump between systems"] },
    ]
  },
  {
    id: "strategy",
    title: "Strategy Evaluation",
    questions: [
      { id: "s1", text: "Do you have a backtested strategy?", type: "single", options: ["Yes, extensively", "A little bit", "No, forward testing only", "No"] },
      { id: "s2", text: "How many setups do you trade?", type: "single", options: ["1-2 specific setups", "3-5 setups", "Anything that looks good"] },
      { id: "s3", text: "Do you understand your edge in the market?", type: "single", options: ["Yes, clearly defined", "Sort of", "Not really"] },
      { id: "s4", text: "Do you know your historical win rate?", type: "single", options: ["Yes, tracked precisely", "Roughly", "No idea"] },
      { id: "s5", text: "Do you know your average risk-reward ratio?", type: "single", options: ["Yes", "Roughly", "No"] },
    ]
  },
  {
    id: "triggers",
    title: "Emotional Triggers",
    questions: [
      { id: "t1", text: "What affects your trading psychology the most? (Select up to 3)", type: "multi", options: [
        "Losing streaks", 
        "Missing trades", 
        "Social media", 
        "Other traders' profits", 
        "News events", 
        "Account drawdown", 
        "Family pressure", 
        "Financial pressure"
      ]}
    ]
  }
];

export interface AssessmentResults {
  scores: {
    psychology: number;
    discipline: number;
    risk: number;
    execution: number;
    stability: number;
    profitabilityReadiness: number;
  };
  personality: {
    name: string;
    description: string;
  };
  rootCauses: Array<{
    title: string;
    description: string;
    severity: number; // 0-10
    fix: string;
  }>;
  actionPlan: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
  aiInsight: string;
}

// A simple deterministic engine that calculates a report based on provided answers
export function generateReport(answers: Record<string, any>): AssessmentResults {
  // In a real app, this would use complex weighted scoring based on specific answers.
  // We simulate dynamic scoring based on the presence of certain answers for realism.

  let riskPenalty = 0;
  if (answers.r1 === "5%+") riskPenalty += 20;
  if (answers.r2 === "Never" || answers.r2 === "Mental Stops") riskPenalty += 25;
  if (answers.r3 === "3-5 times" || answers.r3 === "Lost count") riskPenalty += 15;

  let discPenalty = 0;
  if (answers.d1 === "No" || answers.d1 === "In my head") discPenalty += 20;
  if (answers.d3 === "Almost daily") discPenalty += 30;

  // Psychology score based on scales (1 = bad, 5 = good, but questions are framed negatively, so actually 1=strongly disagree=good, 5=strongly agree=bad)
  // Let's assume the user answered 1-5 where 5 is high anxiety/bad.
  let psychScoreRaw = 0;
  for (let i = 1; i <= 10; i++) {
    const val = parseInt(answers[`ps${i}`]) || 3;
    psychScoreRaw += val; // Higher = worse
  }
  
  const psychScore = Math.max(10, 100 - (psychScoreRaw * 2)); // Map 10-50 to 100-0
  const riskScore = Math.max(10, 100 - riskPenalty - 10);
  const disciplineScore = Math.max(10, 100 - discPenalty - 15);
  const executionScore = Math.floor((disciplineScore + psychScore) / 2);
  const stabilityScore = Math.floor(psychScore * 0.9);
  
  const profitabilityReadiness = Math.floor((psychScore + riskScore + disciplineScore + executionScore) / 4);

  // Personality determination
  const personalities = [
    { name: "The Impulsive Trader", description: "Acts on emotions and reacts instantly to market movement without waiting for proper confirmation.", condition: answers.d4 === "Often due to FOMO" || psychScoreRaw > 35 },
    { name: "The Revenge Trader", description: "Attempts to aggressively recover losses, usually leading to deeper drawdowns.", condition: parseInt(answers.ps3) >= 4 },
    { name: "The Overthinker", description: "Misses trades due to excessive analysis paralysis and fear of being wrong.", condition: parseInt(answers.ps4) >= 4 },
    { name: "The Fearful Trader", description: "Struggles with confidence, closes winners too early, and fears taking valid setups.", condition: parseInt(answers.ps5) >= 4 },
    { name: "The Disciplined Builder", description: "Shows strong potential for consistency with a structured approach.", condition: profitabilityReadiness > 70 },
    { name: "The Professional Mindset", description: "Demonstrates institutional-level habits, pristine risk management, and emotional detachment.", condition: profitabilityReadiness > 85 }
  ];

  const personality = personalities.reverse().find(p => p.condition) || personalities[0];

  return {
    scores: {
      psychology: psychScore,
      discipline: disciplineScore,
      risk: riskScore,
      execution: executionScore,
      stability: stabilityScore,
      profitabilityReadiness: profitabilityReadiness
    },
    personality: {
      name: personality.name,
      description: personality.description
    },
    rootCauses: [
      {
        title: riskScore < 50 ? "Poor Risk Management" : "Inconsistent Sizing",
        description: "Risking too much per trade or failing to use hard stop losses correctly.",
        severity: riskScore < 50 ? 9 : 5,
        fix: "Cap risk at 1% per trade and always place a hard stop loss upon entry."
      },
      {
        title: "Emotional Execution",
        description: "Allowing fear or greed to dictate trade management rather than the original plan.",
        severity: psychScore < 50 ? 8 : 4,
        fix: "Set set-and-forget limit orders and walk away from the screens."
      },
      {
        title: disciplineScore < 50 ? "Lack of Discipline" : "Rule Bending",
        description: "Entering trades before full confirmation or trading outside assigned sessions.",
        severity: disciplineScore < 50 ? 8 : 6,
        fix: "Create a physical checklist and do not execute until every box is checked."
      },
      {
        title: "Overtrading",
        description: "Taking sub-optimal setups out of boredom or revenge.",
        severity: 7,
        fix: "Implement a maximum daily trade limit (e.g., 2 trades/day)."
      },
      {
        title: "Strategy Hopping",
        description: "Changing the system after a few losses instead of thinking in probabilities.",
        severity: 6,
        fix: "Commit to trading one edge for a minimum of 100 consecutive trades."
      }
    ].sort((a, b) => b.severity - a.severity),
    actionPlan: {
      week1: ["Draft a strict, 1-page trading plan", "Cap risk at exactly 1% per trade", "Stop trading after 2 consecutive losses in a day"],
      week2: ["Only take A+ setups matching your criteria", "Log every emotion felt during an active trade", "Do not move your stop loss once set"],
      week3: ["Review trades only at the end of the week, not intra-day", "Practice partial profit-taking to secure wins", "Read 'Trading in the Zone'"],
      week4: ["Evaluate your 30-day win rate objectively", "Identify your top performing asset and time-of-day", "Scale up risk marginally if profitable"]
    },
    aiInsight: `Based on your profile, your profitability is primarily being constrained by ${riskScore < 50 ? 'aggressive risk management' : 'emotional decision-making'}. Your current readiness score is ${profitabilityReadiness}/100. The largest opportunity for immediate growth lies in eliminating impulsive entries and rigidly adhering to predefined risk parameters. By treating trading as a probabilistic business rather than an emotional outlet, you can transition into the consistent minority.`
  };
}
