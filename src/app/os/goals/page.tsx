"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { insforge } from "@/lib/insforge";
import { aiService } from "@/lib/ai";
import { Target, Flag, ShieldAlert, CheckSquare, Zap, Crosshair } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DailyMissionPage() {
  const { activeAccount } = useAccount();
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodayMission();
  }, [activeAccount]);

  const fetchTodayMission = async () => {
    if (!activeAccount) return;
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    try {
      const { data } = await insforge.database
        .from("daily_missions")
        .select("*")
        .eq("account_id", activeAccount.id)
        .eq("date", today)
        .limit(1);

      if (data && data.length > 0) {
        setMission(data[0]);
      } else {
        // Generate new mission for today
        const motivation = await aiService.getAIMotivation();
        const newMission = {
          account_id: activeAccount.id,
          date: today,
          goal_text: "Execute edge flawlessly without hesitation.",
          focus_strategy: "A+ Setup Only",
          max_trades: 3,
          max_risk: 1.5,
          ai_motivation: motivation,
          is_completed: false
        };
        const { data: insertedData, error } = await insforge.database
          .from("daily_missions")
          .insert([newMission])
          .select();
          
        if (insertedData) setMission(insertedData[0]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleComplete = async () => {
    if (!mission) return;
    try {
      await insforge.database
        .from("daily_missions")
        .update({ is_completed: true })
        .eq("id", mission.id);
      setMission({ ...mission, is_completed: true });
    } catch (e) {
      console.error(e);
    }
  };

  if (!activeAccount && !loading) {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center bg-black text-white space-y-4 h-full">
        <ShieldAlert className="w-12 h-12 text-rose-500/50" />
        <h2 className="text-xl font-bold">No Active Account Detected</h2>
        <p className="text-white/50 text-center max-w-sm">You need an active trading account to access missions.</p>
        <p className="text-brand-amber text-sm font-bold uppercase tracking-widest mt-4">
          Click the Account button in the bottom left sidebar to create one!
        </p>
      </div>
    );
  }

  if (!mission && !loading) {
    return <div className="p-10 text-white animate-pulse">Loading mission data...</div>;
  }

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-black text-white space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Mission</h1>
        <p className="text-gray-400">Set your intentions before the market opens.</p>
      </header>

      {loading ? (
        <div className="text-white/50 animate-pulse">Generating today's mission...</div>
      ) : mission && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className={cn("border rounded-2xl p-8 relative overflow-hidden transition-all duration-500", mission.is_completed ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]" : "bg-[#0a0a0a] border-white/10")}>
              
              <div className="flex items-center gap-3 mb-6">
                <Target className={cn("w-8 h-8", mission.is_completed ? "text-emerald-500" : "text-brand-amber")} />
                <h2 className="text-2xl font-black">Today's Objective</h2>
              </div>
              
              <p className="text-xl text-white/90 font-medium mb-8 leading-relaxed">
                "{mission.goal_text}"
              </p>
              
              <div className="bg-[#111] border border-white/5 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-brand-amber mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-amber mb-1">AI Coach Motivation</h4>
                    <p className="text-sm text-white/70 italic">"{mission.ai_motivation}"</p>
                  </div>
                </div>
              </div>

              {!mission.is_completed ? (
                <button onClick={handleComplete} className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-widest rounded-xl transition-colors">
                  Mark Day as Completed
                </button>
              ) : (
                <div className="w-full py-4 bg-emerald-500/20 text-emerald-500 font-bold uppercase tracking-widest rounded-xl text-center border border-emerald-500/30">
                  Mission Accomplished
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4">
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-white/40" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Max Risk / Trade</h3>
              </div>
              <div className="text-4xl font-black font-mono">{mission.max_risk}%</div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-4 h-4 text-white/40" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Max Daily Trades</h3>
              </div>
              <div className="text-4xl font-black font-mono">{mission.max_trades}</div>
            </div>

            <div className="col-span-2 bg-[#0a0a0a] border border-brand-amber/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Crosshair className="w-24 h-24 text-brand-amber" />
              </div>
              <div className="relative z-10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-amber mb-2">Focus Strategy</h3>
                <div className="text-2xl font-black mb-1">{mission.focus_strategy}</div>
                <p className="text-xs text-white/50">Do not execute unless this precise criteria is met.</p>
              </div>
            </div>

            <div className="col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">Pre-Session Checklist</h3>
              <ul className="space-y-3">
                {["Checked high impact news?", "Marked out daily/weekly key levels?", "Mental state clear and rested?", "Agreed to accept the outcome of the trade?"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-white/30" />
                    <span className="text-sm text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </motion.div>

        </div>
      )}
    </div>
  );
}
