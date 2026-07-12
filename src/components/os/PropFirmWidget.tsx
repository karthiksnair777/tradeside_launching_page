"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { insforge } from "@/lib/insforge";
import { Flag, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropFirmWidget() {
  const { activeAccount } = useAccount();
  const [challenge, setChallenge] = useState<any | null>(null);
  const [currentPnl, setCurrentPnl] = useState(0);

  useEffect(() => {
    fetchChallengeAndPnl();
  }, [activeAccount]);

  const fetchChallengeAndPnl = async () => {
    if (!activeAccount) return;
    try {
      const { data: challengeData, error } = await insforge.database
        .from("prop_firm_challenges")
        .select("*")
        .eq("account_id", activeAccount.id);

      if (error) console.error("Error fetching challenge:", error);

      if (challengeData && challengeData.length > 0) {
        // Sort manually to get the latest just in case mock SDK doesn't support .order
        const latest = [...challengeData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        setChallenge(latest);
        
        // Calculate PNL for active challenge
        const { data: trades } = await insforge.database
          .from("trades")
          .select("profit, created_at")
          .eq("account_id", activeAccount.id);
          
        if (trades) {
          const validTrades = trades.filter(t => new Date(t.created_at) >= new Date(latest.created_at));
          const pnl = validTrades.reduce((acc, t) => acc + (Number(t.profit) || 0), 0);
          setCurrentPnl(pnl);
        }
      } else {
        setChallenge(null);
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!challenge || challenge.status !== 'ACTIVE') return null;
  const targetProgress = Math.max(0, Math.min(100, (currentPnl / challenge.profit_target) * 100));
  const isDrawdownRisk = currentPnl < -(challenge.max_daily_drawdown * 0.8);

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Flag className="w-20 h-20 text-brand-amber" />
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Flag className="w-4 h-4 text-brand-amber" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Prop Firm Challenge</h3>
        <span className="ml-auto text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Active</span>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Profit Target</span>
            <span className="text-sm font-mono font-bold text-emerald-500">${currentPnl.toFixed(2)} / ${challenge.profit_target}</span>
          </div>
          <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${targetProgress}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Max Drawdown</span>
            <span className={cn("text-sm font-mono font-bold", isDrawdownRisk ? "text-rose-500" : "text-white/90")}>
              {currentPnl < 0 ? `-$${Math.abs(currentPnl).toFixed(2)}` : '$0.00'} / ${challenge.max_daily_drawdown}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
            <div className={cn("h-full transition-all duration-1000", isDrawdownRisk ? "bg-rose-500" : "bg-white/20")} style={{ width: `${Math.max(0, Math.min(100, (Math.abs(currentPnl < 0 ? currentPnl : 0) / challenge.max_daily_drawdown) * 100))}%` }} />
          </div>
          {isDrawdownRisk && (
            <p className="text-[9px] text-rose-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
              <AlertTriangle size={10} /> Critical Drawdown Level
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
