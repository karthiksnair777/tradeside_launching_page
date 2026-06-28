"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { insforge } from "@/lib/insforge";
import { useAccount } from "@/contexts/AccountContext";

export default function CalendarPage() {
  const { activeAccount } = useAccount();
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    async function fetchTrades() {
      if (!activeAccount) {
        setCalendarData([]);
        return;
      }
      const { data, error } = await insforge.database
        .from("trades")
        .select("*")
        .eq("account_id", activeAccount.id);
      
      if (!error && data) {
        // Simple map of the current month (mocking a 31-day view but populating with real data)
        const daysMap: Record<number, any> = {};
        for (let i = 1; i <= 31; i++) {
          daysMap[i] = { date: i, status: "none", pnl: 0, trades: 0, wins: 0 };
        }

        data.forEach(trade => {
          if (trade.date) {
            // Extract day from YYYY-MM-DD
            const dayStr = trade.date.split('-')[2];
            const dayNum = parseInt(dayStr, 10);
            
            if (daysMap[dayNum]) {
              daysMap[dayNum].trades += 1;
              const pnl = Number(trade.profit || 0);
              daysMap[dayNum].pnl += pnl;
              if (pnl > 0) daysMap[dayNum].wins += 1;
            }
          }
        });

        const finalDays = Object.values(daysMap).map(d => {
          if (d.trades > 0) {
            d.status = d.pnl > 0 ? "profit" : d.pnl < 0 ? "loss" : "none";
            d.winRate = Math.round((d.wins / d.trades) * 100);
          }
          return d;
        });

        setCalendarData(finalDays);
      }
    }
    fetchTrades();
  }, [activeAccount]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Trading Calendar</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Daily Performance Grid</p>
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
          {calendarData.length === 0 ? (
            <div className="col-span-7 text-center p-8 text-xs text-white/40">Loading calendar data...</div>
          ) : (
            <>
              {/* Empty slots for month start (assuming month starts on Wed) */}
              <div className="min-h-[100px] rounded bg-white/[0.01] border border-white/[0.02]"></div>
              <div className="min-h-[100px] rounded bg-white/[0.01] border border-white/[0.02]"></div>
              
              {calendarData.map((day, idx) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
