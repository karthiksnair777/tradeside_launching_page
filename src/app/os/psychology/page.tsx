"use client";

import React, { useState } from "react";
import { ChartWidget } from "@/components/os/ChartWidget";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
} from "recharts";
import { Brain, Flame, Target, Zap, ShieldAlert, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockDisciplineTrend = [
  { date: "Mar 1", score: 65, fear: 80 },
  { date: "Mar 2", score: 70, fear: 75 },
  { date: "Mar 3", score: 68, fear: 70 },
  { date: "Mar 4", score: 85, fear: 60 },
  { date: "Mar 5", score: 90, fear: 50 },
  { date: "Mar 6", score: 95, fear: 40 },
  { date: "Mar 7", score: 88, fear: 45 },
];

const moods = [
  { emoji: "😀", label: "Excellent", color: "border-emerald-500/50 text-emerald-500" },
  { emoji: "🙂", label: "Good", color: "border-emerald-400/50 text-emerald-400" },
  { emoji: "😐", label: "Neutral", color: "border-white/20 text-white/40" },
  { emoji: "😟", label: "Anxious", color: "border-brand-orange/50 text-brand-orange" },
  { emoji: "😡", label: "Frustrated", color: "border-rose-500/50 text-rose-500" }
];

export default function PsychologyPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Psychology</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Mindset Tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        
        {/* Daily Check-in */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04] flex items-center gap-2">
              <Brain size={14} className="text-brand-amber" />
              Daily Check-in
            </h3>
            
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2 font-semibold">Mood</p>
            <div className="flex justify-between gap-1 mb-5">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded flex-1 transition-all border",
                    selectedMood === mood.label 
                      ? `${mood.color} bg-white/5` 
                      : "border-transparent hover:border-white/10 text-white/20 grayscale hover:grayscale-0"
                  )}
                >
                  <span className="text-xl mb-1">{mood.emoji}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest">{mood.label}</span>
                </button>
              ))}
            </div>

            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2 font-semibold">Pre-Session Checklist</p>
            <div className="space-y-2.5 mb-5">
              {[
                "Reviewed trading plan?",
                "Properly rested & focused?",
                "Checked high-impact news?",
                "Accepted risk before entry?"
              ].map((q) => (
                <label key={q} className="flex items-start gap-2.5 cursor-pointer group">
                  <div className="w-3.5 h-3.5 rounded-sm border border-white/[0.1] group-hover:border-brand-amber/50 flex items-center justify-center transition-colors shrink-0 mt-0.5 bg-[#111]">
                    <input type="checkbox" className="hidden peer" />
                    <CheckCircle size={10} className="text-brand-amber opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[11px] text-white/60 group-hover:text-white/90 tracking-wide">{q}</span>
                </label>
              ))}
            </div>

            <button className="w-full py-2.5 rounded bg-brand-amber text-[#0a0a0a] font-bold text-sm uppercase tracking-wider hover:bg-brand-amber/90 transition-all">
              Save Check-in
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0a0a0a] p-3 rounded-lg border border-white/[0.04]">
              <div className="flex justify-between items-start mb-1">
                <Target size={14} className="text-white/40" />
                <span className="text-[10px] text-emerald-500 font-bold font-mono">+5%</span>
              </div>
              <p className="text-xl font-bold font-mono text-white/90">92%</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">Discipline</p>
            </div>
            <div className="bg-[#0a0a0a] p-3 rounded-lg border border-white/[0.04]">
              <div className="flex justify-between items-start mb-1">
                <Zap size={14} className="text-white/40" />
                <span className="text-[10px] text-rose-500 font-bold font-mono">+12%</span>
              </div>
              <p className="text-xl font-bold font-mono text-white/90">14%</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">FOMO Rate</p>
            </div>
          </div>
        </div>

        {/* Charts and Insights */}
        <div className="xl:col-span-2 space-y-4">
          <ChartWidget title="Discipline Trend" subtitle="Discipline vs Fear (7D)" height={260}>
            <LineChart data={mockDisciplineTrend} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }} name="Discipline Score" />
              <Line type="monotone" dataKey="fear" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: "#f43f5e", strokeWidth: 0 }} name="Fear / Anxiety" />
            </LineChart>
          </ChartWidget>

          <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04] flex items-center gap-2">
              <Flame size={14} className="text-brand-orange" />
              Behavioral Insights
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-[#111] border border-white/[0.04] flex gap-3">
                <ShieldAlert className="text-rose-500 shrink-0 mt-0.5" size={14} />
                <div>
                  <h4 className="font-semibold text-rose-500 text-xs mb-1 uppercase tracking-wide">Revenge Trading Warning</h4>
                  <p className="text-[11px] text-white/50 leading-relaxed">Data shows you are 60% more likely to break rules immediately after a loss on GBP/JPY. Take a mandatory 15-minute break.</p>
                </div>
              </div>
              <div className="p-3 rounded-md bg-[#111] border border-white/[0.04] flex gap-3">
                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                <div>
                  <h4 className="font-semibold text-emerald-500 text-xs mb-1 uppercase tracking-wide">Consistency Improving</h4>
                  <p className="text-[11px] text-white/50 leading-relaxed">You have successfully avoided moving your stop loss early for 7 consecutive days, increasing average Risk/Reward by 12%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
