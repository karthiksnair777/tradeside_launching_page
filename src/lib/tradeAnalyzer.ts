export function generateTradeAdvice(trade: any): string {
  if (!trade) return "";
  
  const advice = [];
  const profit = trade.profit || 0;
  const isLoss = profit < 0 || trade.result === "Loss";
  const isWin = profit > 0 || trade.result === "Win";
  const stress = trade.stress || 5;
  const confidence = trade.confidence || 5;
  
  // Risk Management
  if (isLoss && !trade.stop_loss) {
    advice.push("You traded without a stop loss on a losing trade, exposing your account to excessive risk. Always define your risk before entering.");
  }
  if (isLoss && trade.risk_amount && Math.abs(profit) > trade.risk_amount * 1.5) {
    advice.push("Your loss exceeded your planned risk amount significantly. Ensure you are cutting losses at your defined invalidation point.");
  }

  // Psychology
  if (stress >= 8) {
    advice.push("Your stress levels were very high (8+). High stress often leads to irrational decisions like moving stops or closing early. Consider reducing your position size next time to stay emotionally detached.");
  } else if (stress <= 3 && isLoss) {
    advice.push("You were very relaxed during this loss. Ensure you aren't becoming complacent or detached from your risk.");
  }

  if (confidence <= 4) {
    advice.push("You took this trade with low confidence. Stick to your A+ setups and avoid forcing trades when the edge isn't clear.");
  } else if (confidence >= 9 && isLoss) {
    advice.push("You were highly confident but the trade failed. Review if you ignored contrary evidence due to overconfidence or bias.");
  }

  // Mistakes
  if (trade.mistakes && trade.mistakes.trim().length > 0) {
    if (isWin) {
      advice.push("You made a profit, but still identified mistakes. Don't let a positive outcome reinforce bad habits. Focus on the process, not just the result.");
    } else {
      advice.push("You identified specific mistakes. Write down a strict rule to prevent this specific error from happening again tomorrow.");
    }
  }

  if (advice.length === 0) {
    if (isWin) {
      return "Solid trade execution. Keep repeating this process and maintain your discipline.";
    } else {
      return "Losses are part of the game. If you followed your plan, accept the outcome and move to the next setup.";
    }
  }

  return advice.join(" ");
}

export function generateOverallAdvice(trades: any[]): string[] {
  if (!trades || trades.length === 0) return [];
  
  const advice = [];
  let totalStressLosses = 0;
  let totalLosses = 0;
  let noStopLossCount = 0;
  let highConfidenceLossCount = 0;
  let totalMistakes = 0;

  trades.forEach(t => {
    const isLoss = t.profit < 0 || t.result === "Loss";
    if (isLoss) {
      totalLosses++;
      if (t.stress >= 7) totalStressLosses++;
      if (!t.stop_loss) noStopLossCount++;
      if (t.confidence >= 8) highConfidenceLossCount++;
    }
    if (t.mistakes && t.mistakes.trim().length > 0) {
      totalMistakes++;
    }
  });

  if (totalLosses > 0) {
    if (totalStressLosses / totalLosses >= 0.5) {
      advice.push("You experience high stress on most of your losing trades. Consider scaling down your lot size to build emotional resilience.");
    }
    if (noStopLossCount > 0) {
      advice.push(`You took ${noStopLossCount} losing trade(s) without a stop loss. This is a critical risk management flaw that must be fixed immediately.`);
    }
    if (highConfidenceLossCount / totalLosses >= 0.4) {
      advice.push("You frequently lose trades where you have very high confidence. You might be suffering from confirmation bias. Look for reasons why a trade might fail before entering.");
    }
  }

  if (totalMistakes > trades.length * 0.4) {
    advice.push("You are recording mistakes on a large percentage of your trades. Slow down your execution and double-check your checklist before pulling the trigger.");
  }

  if (advice.length === 0) {
    advice.push("Your core metrics look stable. Focus on refining your edge and maintaining consistency.");
  }

  return advice;
}
