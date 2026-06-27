"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock calendar data
const generateDays = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    const isTradingDay = i % 7 !== 0 && i % 7 !== 6; 
    let status: "profit" | "loss" | "none" = "none";
    let pnl = 0;
    
    if (isTradingDay) {
      const rand = Math.random();
      if (rand > 0.6) {
        status = "profit";
        pnl = Math.floor(Math.random() * 1500) + 100;
      } else if (rand > 0.3) {
        status = "loss";
        pnl = -(Math.floor(Math.random() * 800) + 50);
      }
    }

    days.push({
      date: i,
      status,
      pnl,
      trades: status !== "none" ? Math.floor(Math.random() * 5) + 1 : 0,
      winRate: status !== "none" ? Math.floor(Math.random() * 40) + 40 : 0
    });
  }
  return days;
};

const days = generateDays();
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Trading Calendar</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Daily Performance Grid</p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex bg-[#0a0a0a] p-1 rounded border border-white/[0.04]">
            <button className="px-3 py-1 rounded bg-white/5 text-[11px] font-bold tracking-wider text-white border border-white/[0.04] uppercase">Month</button>
            <button className="px-3 py-1 rounded text-[11px] font-bold tracking-wider text-white/40 hover:text-white/90 transition-all uppercase">Week</button>
          </div>
          
          <div className="flex items-center gap-2 bg-[#0a0a0a] px-3 py-1 rounded border border-white/[0.04]">
            <button className="text-white/40 hover:text-brand-amber transition-colors"><ChevronLeft size={14} /></button>
            <span className="font-bold text-xs w-20 text-center uppercase tracking-widest text-white/90">Mar '24</span>
            <button className="text-white/40 hover:text-brand-amber transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {/* Empty slots for month start (assuming month starts on Wed) */}
          <div className="min-h-[100px] rounded bg-white/[0.01] border border-white/[0.02]"></div>
          <div className="min-h-[100px] rounded bg-white/[0.01] border border-white/[0.02]"></div>
          
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={cn(
                "min-h-[100px] rounded p-2 border transition-all duration-300 relative group cursor-pointer flex flex-col justify-between",
                day.status === "profit" ? "bg-emerald-500/[0.03] border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40" :
                day.status === "loss" ? "bg-rose-500/[0.03] border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40" :
                "bg-white/[0.01] border-white/[0.02] hover:border-white/10"
              )}
            >
              <span className={cn(
                "text-[10px] font-bold block mb-1 font-mono",
                day.status === "profit" ? "text-emerald-500/70 group-hover:text-emerald-400" :
                day.status === "loss" ? "text-rose-500/70 group-hover:text-rose-400" :
                "text-white/20"
              )}>
                {day.date}
              </span>

              {day.status !== "none" && (
                <div className="text-right">
                  <div className={cn(
                    "font-bold text-sm font-mono tracking-tight",
                    day.status === "profit" ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {day.pnl > 0 ? "+" : ""}${Math.abs(day.pnl)}
                  </div>
                  <div className="text-[9px] text-white/40 mt-0.5 font-bold uppercase tracking-wider">
                    {day.trades} T
                  </div>
                </div>
              )}

              {/* Hover Tooltip */}
              {day.status !== "none" && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 bg-[#111] p-2.5 rounded shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-white/40 uppercase tracking-widest font-semibold">Net P/L</span>
                    <span className={cn("font-bold font-mono", day.status === "profit" ? "text-emerald-500" : "text-rose-500")}>
                      {day.pnl > 0 ? "+" : ""}${Math.abs(day.pnl)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-white/40 uppercase tracking-widest font-semibold">Trades</span>
                    <span className="text-white font-bold font-mono">{day.trades}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40 uppercase tracking-widest font-semibold">Win Rate</span>
                    <span className="text-white font-bold font-mono">{day.winRate}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
