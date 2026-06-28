"use client";

import React, { useEffect, useState } from "react";
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
import { insforge } from "@/lib/insforge";

const moods = [
  { emoji: "😀", label: "Excellent", color: "border-emerald-500/50 text-emerald-500" },
  { emoji: "🙂", label: "Good", color: "border-emerald-400/50 text-emerald-400" },
  { emoji: "😐", label: "Neutral", color: "border-white/20 text-white/40" },
  { emoji: "😟", label: "Anxious", color: "border-brand-orange/50 text-brand-orange" },
  { emoji: "😡", label: "Frustrated", color: "border-rose-500/50 text-rose-500" }
];

export default function PsychologyPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [disciplineScore, setDisciplineScore] = useState(0);

  const [checklist, setChecklist] = useState({
    reviewed_plan: false,
    properly_rested: false,
    checked_news: false,
    accepted_risk: false
  });

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    const { data, error } = await insforge.database
      .from("daily_checkins")
      .select("*")
      .order("created_at", { ascending: true });
      
    if (!error && data) {
      setCheckins(data);
      
      let totalDiscipline = 0;
      const trends = data.map(c => {
        let score = 50;
        if (c.mood === "Excellent") score += 20;
        if (c.mood === "Good") score += 10;
        if (c.mood === "Anxious") score -= 10;
        if (c.mood === "Frustrated") score -= 20;
        
        if (c.reviewed_plan) score += 10;
        if (c.properly_rested) score += 10;
        if (c.checked_news) score += 10;
        if (c.accepted_risk) score += 10;

        totalDiscipline += score;
        
        return {
          date: c.date.substring(5),
          score: Math.min(100, score),
          fear: c.mood === "Anxious" || c.mood === "Frustrated" ? 80 : 30
        };
      });

      setTrendData(trends);
      if (data.length > 0) {
        setDisciplineScore(Math.round(totalDiscipline / data.length));
      }
    }
  };

  const handleSaveCheckin = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    
    const payload = {
      date: today,
      mood: selectedMood,
      ...checklist
    };

    const { error } = await insforge.database.from("daily_checkins").insert([payload]);
    
    if (error) {
      alert("Failed to save checkin.");
      console.error(error);
    } else {
      alert("Check-in saved!");
      fetchCheckins();
    }
    setLoading(false);
  };

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
              {Object.entries(checklist).map(([key, val]) => (
                <label key={key} className="flex items-start gap-2.5 cursor-pointer group">
                  <div className="w-3.5 h-3.5 rounded-sm border border-white/[0.1] group-hover:border-brand-amber/50 flex items-center justify-center transition-colors shrink-0 mt-0.5 bg-[#111]">
                    <input type="checkbox" checked={val} onChange={(e) => setChecklist({...checklist, [key]: e.target.checked})} className="hidden peer" />
                    <CheckCircle size={10} className="text-brand-amber opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[11px] text-white/60 group-hover:text-white/90 tracking-wide capitalize">{key.replace(/_/g, ' ')}?</span>
                </label>
              ))}
            </div>

            <button 
              onClick={handleSaveCheckin}
              disabled={loading}
              className="w-full py-2.5 rounded bg-brand-amber text-[#0a0a0a] font-bold text-sm uppercase tracking-wider hover:bg-brand-amber/90 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Check-in"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0a0a0a] p-3 rounded-lg border border-white/[0.04]">
              <div className="flex justify-between items-start mb-1">
                <Target size={14} className="text-white/40" />
              </div>
              <p className="text-xl font-bold font-mono text-white/90">{disciplineScore}%</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">Avg Discipline</p>
            </div>
            <div className="bg-[#0a0a0a] p-3 rounded-lg border border-white/[0.04]">
              <div className="flex justify-between items-start mb-1">
                <Zap size={14} className="text-white/40" />
              </div>
              <p className="text-xl font-bold font-mono text-white/90">{checkins.length}</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">Logs</p>
            </div>
          </div>
        </div>

        {/* Charts and Insights */}
        <div className="xl:col-span-2 space-y-4">
          <ChartWidget title="Discipline Trend" subtitle="Discipline vs Fear" height={260}>
            {trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/40 text-xs">No check-in data yet.</div>
            ) : (
              <LineChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}
                />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }} name="Discipline Score" />
                <Line type="monotone" dataKey="fear" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: "#f43f5e", strokeWidth: 0 }} name="Fear / Anxiety" />
              </LineChart>
            )}
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
                  <h4 className="font-semibold text-rose-500 text-xs mb-1 uppercase tracking-wide">AI Analysis</h4>
                  <p className="text-[11px] text-white/50 leading-relaxed">Logging your daily psychology helps AI identify specific emotional triggers that lead to drawdowns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
