import React, { useMemo } from "react";
import { Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { generateOverallAdvice } from "@/lib/tradeAnalyzer";

export function AICoachPanel({ trades = [] }: { trades?: any[] }) {
  
  const insights = useMemo(() => {
    if (!trades || trades.length === 0) return null;

    let pairStats: Record<string, { wins: number; total: number; pnl: number }> = {};
    let recentImprovements: string[] = [];

    // trades are already sorted by date usually, so latest are first
    trades.forEach(t => {
      if (t.pair) {
        const pair = t.pair.toUpperCase();
        if (!pairStats[pair]) pairStats[pair] = { wins: 0, total: 0, pnl: 0 };
        pairStats[pair].total++;
        if (t.profit > 0) pairStats[pair].wins++;
        pairStats[pair].pnl += (t.profit || 0);
      }
      
      if (t.improvement_notes && recentImprovements.length < 2) {
        recentImprovements.push(t.improvement_notes);
      }
    });

    let bestPair = "";
    let bestPairWinRate = 0;
    let worstPair = "";
    let worstPairLoss = 0;

    Object.entries(pairStats).forEach(([pair, stats]) => {
      const winRate = (stats.wins / stats.total) * 100;
      if (stats.total >= 1 && winRate >= bestPairWinRate && stats.pnl > 0) {
        bestPair = pair;
        bestPairWinRate = winRate;
      }
      if (stats.total >= 1 && stats.pnl < worstPairLoss) {
        worstPair = pair;
        worstPairLoss = stats.pnl;
      }
    });

    const overallAdvice = generateOverallAdvice(trades);
    const allImprovements = [...overallAdvice, ...recentImprovements];

    return { bestPair, bestPairWinRate, worstPair, recentImprovements: allImprovements };
  }, [trades]);

  return (
    <div className="bg-[#0a0a0a] border border-brand-amber/10 p-5 rounded-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none group-hover:bg-brand-amber/10 transition-all duration-700"></div>
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="w-8 h-8 rounded bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center text-brand-amber">
          <Brain size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold flex items-center gap-1.5 text-white/90">
            Performance Analysis
            <Sparkles size={12} className="text-brand-amber" />
          </h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Overall Data</p>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {!insights || (!insights.bestPair && !insights.worstPair && insights.recentImprovements.length === 0) ? (
           <div className="text-xs text-white/50 p-4 text-center border border-white/[0.04] rounded-md bg-white/[0.02]">
             Log more detailed trades to get automated performance analysis and improvement tips here.
           </div>
        ) : (
          <>
            {insights.bestPair && (
              <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-start gap-2.5">
                  <TrendingUp size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold mb-1 text-white/90">{insights.bestPair} Optimization</p>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      You have a <strong className="text-white/80 font-mono">{insights.bestPairWinRate.toFixed(0)}%</strong> win rate trading <span className="uppercase text-white/80">{insights.bestPair}</span>. Consider focusing more on this pair.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {insights.worstPair && (
              <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={14} className="text-brand-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold mb-1 text-white/90">{insights.worstPair} Underperformance</p>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      You are consistently losing on <span className="uppercase text-brand-orange">{insights.worstPair}</span>. Review these setups or reduce lot sizing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {insights.recentImprovements.length > 0 && (
              <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-start gap-2.5">
                  <Lightbulb size={14} className="text-brand-amber mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold mb-1 text-white/90">Areas to Improve</p>
                    <ul className="text-[11px] text-white/50 leading-relaxed list-disc list-inside space-y-1">
                      {insights.recentImprovements.map((note, i) => (
                        <li key={i} className="line-clamp-2">{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
