"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { insforge } from "@/lib/insforge";
import { Dna, Fingerprint, Activity, Zap, TrendingUp, TrendingDown, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TradingDNAPage() {
  const { activeAccount } = useAccount();
  const [loading, setLoading] = useState(true);
  const [dna, setDna] = useState<any>(null);

  useEffect(() => {
    fetchTradesAndCalculateDNA();
  }, [activeAccount]);

  const fetchTradesAndCalculateDNA = async () => {
    if (!activeAccount) return;
    setLoading(true);
    try {
      const { data: trades } = await insforge.database
        .from("trades")
        .select("*")
        .eq("account_id", activeAccount.id);

      if (trades && trades.length > 0) {
        // Calculate DNA metrics
        const winTrades = trades.filter((t:any) => t.result === 'Win');
        
        // Helper to get most frequent item
        const getMostFrequent = (arr: string[]) => {
          if(!arr.length) return "N/A";
          const counts = arr.reduce((acc:any, val) => { acc[val] = (acc[val] || 0) + 1; return acc; }, {});
          return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        };

        const pairs = trades.map((t:any) => t.pair);
        const winPairs = winTrades.map((t:any) => t.pair);
        const lossPairs = trades.filter((t:any) => t.result === 'Loss').map((t:any) => t.pair);
        
        const sessions = winTrades.map((t:any) => t.session);
        const setups = winTrades.map((t:any) => t.setup);
        
        // Avg RR
        const rrs = winTrades.map((t:any) => t.profit / (t.risk || 1)).filter((rr:number) => !isNaN(rr) && isFinite(rr) && rr > 0);
        const avgRR = rrs.length ? rrs.reduce((a:number,b:number)=>a+b, 0) / rrs.length : 0;

        // Personality heuristic
        let personality = "The Technician";
        if (trades.length > 20 && avgRR > 3) personality = "The Sniper";
        else if (trades.filter((t:any)=>t.timeframe === '1M' || t.timeframe === '5M').length > trades.length / 2) personality = "The Scalper";
        else if (trades.filter((t:any)=>t.timeframe === 'Daily' || t.timeframe === '4H').length > trades.length / 2) personality = "The Swing Trader";

        setDna({
          bestPair: getMostFrequent(winPairs),
          worstPair: getMostFrequent(lossPairs),
          bestSession: getMostFrequent(sessions),
          bestSetup: getMostFrequent(setups),
          avgRR: avgRR.toFixed(2),
          personality,
          totalTrades: trades.length,
          winRate: ((winTrades.length / trades.length) * 100).toFixed(1)
        });
      } else {
        setDna(null);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-black text-white space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Trading DNA</h1>
        <p className="text-gray-400">Your unique psychological and statistical trading profile.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-white/50">Analyzing trading history...</div>
      ) : !dna ? (
        <div className="flex items-center justify-center h-64 text-white/50 border border-white/5 rounded-2xl bg-[#0a0a0a]">
          Not enough data to generate Trading DNA. Log more trades.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Identity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
            <div className="bg-[#0a0a0a] border border-brand-amber/20 rounded-2xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-[0_0_50px_rgba(255,184,0,0.05)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="w-32 h-32 rounded-full border-4 border-brand-amber/20 flex items-center justify-center bg-black relative z-10 shrink-0">
                <Fingerprint className="w-16 h-16 text-brand-amber" />
              </div>
              
              <div className="relative z-10 text-center md:text-left">
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-2">Trader Archetype</h2>
                <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">{dna.personality}</h3>
                <p className="text-white/60 max-w-xl">
                  Based on {dna.totalTrades} logged trades, your statistical footprint indicates you excel when waiting for high-probability setups rather than forcing volume.
                </p>
              </div>
            </div>
          </motion.div>

          {/* DNA Stats Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-500" /></div>
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Best Pair</h4>
              </div>
              <div className="text-3xl font-bold font-mono">{dna.bestPair}</div>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-500/10 rounded-lg"><TrendingDown className="w-5 h-5 text-rose-500" /></div>
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Worst Pair</h4>
              </div>
              <div className="text-3xl font-bold font-mono">{dna.worstPair}</div>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-amber/10 rounded-lg"><Clock className="w-5 h-5 text-brand-amber" /></div>
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Best Session</h4>
              </div>
              <div className="text-3xl font-bold">{dna.bestSession}</div>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Target className="w-5 h-5 text-blue-500" /></div>
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Top Setup</h4>
              </div>
              <div className="text-3xl font-bold truncate" title={dna.bestSetup}>{dna.bestSetup}</div>
            </div>
          </motion.div>

          {/* DNA Sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="bg-brand-amber/5 border border-brand-amber/20 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-brand-amber uppercase tracking-widest mb-4">Performance Edge</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] text-brand-amber/70 uppercase font-bold mb-1">Win Rate Edge</div>
                  <div className="text-3xl font-mono font-bold text-white/90">{dna.winRate}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-brand-amber/70 uppercase font-bold mb-1">Average RR Edge</div>
                  <div className="text-3xl font-mono font-bold text-white/90">1 : {dna.avgRR}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">AI Insight</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Your DNA shows you are highly profitable trading {dna.bestPair} during {dna.bestSession}. However, you give back profits when trading {dna.worstPair}. A simple rule to avoid {dna.worstPair} would instantly increase your equity curve trajectory.
              </p>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
}
