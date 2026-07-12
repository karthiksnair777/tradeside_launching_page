// Simulated AI Service
// This acts as a placeholder for a real LLM integration (OpenAI/Anthropic).
// It generates heuristic-based insights based on input data.

import { Trade, TradingPlan } from "@/types/database";

export const aiService = {
  async generateTradeSummary(trade: Trade, plan?: TradingPlan): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let summary = `This was a ${trade.result} trade on ${trade.pair}. `;
    
    if (plan) {
      if (plan.direction === trade.direction) {
        summary += `You followed your directional bias (${plan.direction}). `;
      } else {
        summary += `You traded against your planned bias (${plan.direction} vs planned ${plan.bias}). `;
      }
    }
    
    if (trade.result === 'Win') {
      summary += `Good job catching the ${trade.setup} setup. `;
    } else if (trade.result === 'Loss') {
      summary += `Review if the ${trade.setup} setup was valid or forced. `;
    }
    
    return summary + "Maintain discipline on the next execution.";
  },

  async extractMistakes(trade: Trade): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mistakes: string[] = [];
    
    if (trade.mood === 'Anxious' || trade.mood === 'Frustrated') {
      mistakes.push("Emotional Execution");
    }
    if (trade.rr < 1 && trade.result === 'Win') {
      mistakes.push("Poor Risk/Reward Validation");
    }
    if (trade.tags.includes("FOMO")) {
      mistakes.push("Chasing Price (FOMO)");
    }
    
    return mistakes.length > 0 ? mistakes : ["None detected"];
  },

  async generateWeeklyReview(trades: Trade[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (!trades.length) return "No trades taken this week. Rest is also a position.";
    
    const wins = trades.filter(t => t.result === 'Win').length;
    const winRate = (wins / trades.length) * 100;
    
    let review = `### Weekly AI Review\n\n`;
    review += `**Volume:** ${trades.length} trades taken.\n`;
    review += `**Win Rate:** ${winRate.toFixed(1)}%\n\n`;
    
    if (winRate > 50) {
      review += `**Strengths:** You showed solid consistency this week. Keep leaning into your top performing pairs.\n`;
    } else {
      review += `**Area of Focus:** Your win rate is lower than optimal. Consider reducing your size and focusing only on A+ setups.\n`;
    }
    
    const emotions = trades.map(t => t.mood);
    if (emotions.includes('Frustrated') || emotions.includes('Anxious')) {
      review += `**Psychology Note:** I noticed signs of frustration in your journal. Remember to step away after a tough loss.\n`;
    }
    
    return review;
  },

  async getAIMotivation(): Promise<string> {
    const quotes = [
      "The goal of a successful trader is to make the best trades. Money is secondary.",
      "Don't worry about what the markets are going to do, worry about what you are going to do in response.",
      "Plan your trade and trade your plan.",
      "Consistency is the true mark of a professional.",
      "Risk management is the ultimate edge."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  },

  async answerQuestion(question: string, contextTrades: Trade[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const q = question.toLowerCase();
    
    if (q.includes("weakness")) {
      return "Based on your journal, your biggest weakness appears to be trading during the Asian session, where your win rate drops significantly.";
    }
    if (q.includes("best setup")) {
      const setups = contextTrades.filter(t => t.result === 'Win').map(t => t.setup);
      if (setups.length > 0) {
        return `Your best performing setup recently has been '${setups[0]}'. I suggest waiting for this specific pattern.`;
      }
      return "You don't have enough data on a single winning setup yet. Keep logging your trades!";
    }
    if (q.includes("losing")) {
      return "Recent losses correlate strongly with 'Anxious' mood logs and taking trades outside your main session.";
    }
    
    return "I've analyzed your journal, but I need a more specific question about your performance, setups, or psychology.";
  }
};
