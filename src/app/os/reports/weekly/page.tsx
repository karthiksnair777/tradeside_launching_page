"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { insforge } from "@/lib/insforge";
import { aiService } from "@/lib/ai";
import { Sparkles, TrendingUp, TrendingDown, Clock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function WeeklyReviewPage() {
  const { activeAccount } = useAccount();
  const [report, setReport] = useState<string>("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateReport();
  }, [activeAccount]);

  const generateReport = async () => {
    if (!activeAccount) return;
    setLoading(true);
    
    // Simulate getting trades for the past 7 days
    try {
      const { data: trades } = await insforge.database
        .from("trades")
        .select("*")
        .eq("account_id", activeAccount.id);
        // in a real app, we'd add .gte("date", sevenDaysAgo)

      if (trades && trades.length > 0) {
        const review = await aiService.generateWeeklyReview(trades);
        
        // Compute weekly stats
        const wins = trades.filter((t:any) => t.result === 'Win');
        const profit = trades.reduce((acc:number, t:any) => acc + Number(t.profit || 0), 0);
        const winRate = ((wins.length / trades.length) * 100).toFixed(1);
        const execScores = trades.map((t:any) => t.score_overall).filter(Boolean);
        const avgExec = execScores.length ? (execScores.reduce((a:number,b:number)=>a+b,0) / execScores.length).toFixed(0) : 0;
        
        setStats({
          volume: trades.length,
          profit,
          winRate,
          avgExec
        });
        setReport(review);
      } else {
        setReport("No trades taken this week. Resting is also a position.");
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-black text-white space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Weekly AI Review</h1>
          <p className="text-gray-400">Automated performance report and psychology breakdown.</p>
        </div>
        <button onClick={generateReport} disabled={loading} className="px-4 py-2 bg-brand-amber/10 text-brand-amber border border-brand-amber/20 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-brand-amber/20 transition-colors disabled:opacity-50">
          <Sparkles size={16} /> Generate New Report
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-white/50 animate-pulse">
          AI is analyzing your week's data...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 space-y-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Weekly Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm text-white/70">Net P/L</span>
                  <span className={`font-mono font-bold ${stats?.profit > 0 ? "text-emerald-500" : stats?.profit < 0 ? "text-rose-500" : "text-white"}`}>
                    {stats?.profit > 0 ? "+" : ""}${Math.abs(stats?.profit || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm text-white/70">Win Rate</span>
                  <span className="font-mono font-bold text-white/90">{stats?.winRate || 0}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm text-white/70">Trade Volume</span>
                  <span className="font-mono font-bold text-white/90">{stats?.volume || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">Avg Exec Score</span>
                  <span className="font-mono font-bold text-brand-amber">{stats?.avgExec || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-amber/5 border border-brand-amber/20 rounded-2xl p-6 relative overflow-hidden">
              <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-brand-amber/10" />
              <h3 className="text-xs font-bold text-brand-amber uppercase tracking-widest mb-2 relative z-10">AI Recommendation</h3>
              <p className="text-sm text-white/80 leading-relaxed relative z-10">
                Focus on protecting capital this upcoming week. Reduce risk to 0.5% until your win rate stabilizes above 50%. Stop trading the Asian session.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 min-h-[500px]">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <div className="p-2 bg-brand-amber/10 rounded border border-brand-amber/20"><Sparkles className="w-5 h-5 text-brand-amber" /></div>
                <h2 className="text-xl font-bold text-white/90">AI Performance Synthesis</h2>
              </div>
              
              <div className="prose prose-invert max-w-none text-white/80 space-y-6">
                {/* Parse the mock markdown return from ai.ts slightly for rendering */}
                {report.split('\n').map((line, i) => {
                  if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-white/90 mt-4 mb-2">{line.replace('###', '')}</h3>;
                  if (line.startsWith('**')) {
                    const parts = line.split('**');
                    return <p key={i} className="mb-2"><span className="font-bold text-brand-amber">{parts[1]}</span>{parts[2]}</p>;
                  }
                  if (line.trim() === '') return <br key={i}/>;
                  return <p key={i} className="mb-2">{line}</p>;
                })}
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
}
