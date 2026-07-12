"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Clock, Activity, AlertTriangle, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { insforge } from "@/lib/insforge";
import { useAccount } from "@/contexts/AccountContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  const { activeAccount } = useAccount();
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    fetchTrades();
  }, [activeAccount]);

  async function fetchTrades() {
    if (!activeAccount) {
      setCalendarData([]);
      return;
    }
    const { data, error } = await insforge.database
      .from("trades")
      .select("*, trading_plans(*)")
      .eq("account_id", activeAccount.id);
    
    if (!error && data) {
      const daysMap: Record<number, any> = {};
      for (let i = 1; i <= 31; i++) {
        daysMap[i] = { date: i, status: "none", pnl: 0, trades: [], execScores: [] };
      }

      data.forEach(trade => {
        if (trade.date) {
          const dayStr = trade.date.split('-')[2];
          const dayNum = parseInt(dayStr, 10);
          
          if (daysMap[dayNum]) {
            daysMap[dayNum].trades.push(trade);
            const pnl = Number(trade.profit || 0);
            daysMap[dayNum].pnl += pnl;
            if (trade.score_overall) {
              daysMap[dayNum].execScores.push(trade.score_overall);
            }
          }
        }
      });

      const finalDays = Object.values(daysMap).map(d => {
        if (d.trades.length > 0) {
          d.status = d.pnl > 0 ? "profit" : d.pnl < 0 ? "loss" : "none";
          d.winRate = Math.round((d.trades.filter((t:any) => t.result === 'Win').length / d.trades.length) * 100);
          d.avgExecScore = d.execScores.length ? Math.round(d.execScores.reduce((a:any,b:any)=>a+b,0) / d.execScores.length) : 0;
        }
        return d;
      });

      setCalendarData(finalDays);
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto bg-black text-white h-full relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Performance Calendar</h1>
          <p className="text-gray-400">Daily breakdown of execution, psychology, and profit.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/10 shadow-xl overflow-x-auto">
        <div className="min-w-[700px]">
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
                <div className="min-h-[120px] rounded bg-[#111] border border-white/5 opacity-50 pointer-events-none"></div>
                <div className="min-h-[120px] rounded bg-[#111] border border-white/5 opacity-50 pointer-events-none"></div>
                
                {calendarData.map((day, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => day.trades.length > 0 && setSelectedDay(day)}
                    className={cn(
                      "min-h-[120px] rounded-xl p-3 border transition-all duration-300 relative group flex flex-col justify-between",
                      day.status === "profit" ? "bg-emerald-500/[0.05] border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40 cursor-pointer" :
                      day.status === "loss" ? "bg-rose-500/[0.05] border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40 cursor-pointer" :
                      "bg-[#111] border-white/5 opacity-80"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span className={cn(
                        "text-[10px] font-bold block mb-1 font-mono",
                        day.status === "profit" ? "text-emerald-500/70" :
                        day.status === "loss" ? "text-rose-500/70" :
                        "text-white/20"
                      )}>
                        {day.date}
                      </span>
                      {day.avgExecScore > 0 && (
                        <span className="text-[9px] font-bold uppercase text-brand-amber bg-brand-amber/10 px-1 rounded">
                          EX: {day.avgExecScore}
                        </span>
                      )}
                    </div>

                    {day.status !== "none" && (
                      <div className="text-right mt-2">
                        <div className={cn(
                          "font-bold text-lg font-mono tracking-tight",
                          day.status === "profit" ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {day.pnl > 0 ? "+" : ""}${Math.abs(day.pnl)}
                        </div>
                        <div className="text-[10px] text-white/40 mt-1 font-bold uppercase tracking-wider flex justify-end gap-2">
                          <span>{day.trades.length} TRD</span>
                          <span>{day.winRate}% W</span>
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

      {/* Replay Timeline Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" 
            onClick={() => setSelectedDay(null)}
          >
            <motion.div 
              initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white/90">Day Replay Timeline</h2>
                  <p className="text-xs md:text-sm font-mono text-white/40 mt-1">Date: 2026-07-{String(selectedDay.date).padStart(2, '0')}</p>
                </div>
                <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white shrink-0">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-black">
                {/* Daily Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Net P/L</p>
                    <p className={cn("text-xl font-bold font-mono", selectedDay.pnl > 0 ? "text-emerald-500" : "text-rose-500")}>
                      {selectedDay.pnl > 0 ? "+" : ""}${Math.abs(selectedDay.pnl)}
                    </p>
                  </div>
                  <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Exec Score</p>
                    <p className="text-xl font-bold font-mono text-brand-amber">{selectedDay.avgExecScore || '-'}</p>
                  </div>
                  <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Win Rate</p>
                    <p className="text-xl font-bold font-mono text-white/90">{selectedDay.winRate}%</p>
                  </div>
                  <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Trades</p>
                    <p className="text-xl font-bold font-mono text-white/90">{selectedDay.trades.length}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative border-l-2 border-white/10 ml-4 space-y-8 pb-4">
                  {selectedDay.trades.map((trade: any, idx: number) => (
                    <div key={trade.id} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div className={cn(
                        "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-black",
                        trade.profit > 0 ? "bg-emerald-500" : trade.profit < 0 ? "bg-rose-500" : "bg-white/50"
                      )} />
                      
                      <div className="bg-[#111] border border-white/10 rounded-xl p-4 md:p-5 shadow-lg relative group hover:border-brand-amber/30 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 gap-2">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <h4 className="text-base md:text-lg font-bold text-white/90 uppercase">{trade.pair}</h4>
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", trade.direction === "Long" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                              {trade.direction}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-white/40 font-mono w-full md:w-auto"><Clock size={12}/> {trade.time}</span>
                          </div>
                          <div className={cn("text-lg font-mono font-bold", trade.profit > 0 ? "text-emerald-500" : "text-rose-500")}>
                            {trade.profit > 0 ? "+" : ""}${Math.abs(trade.profit)}
                          </div>
                        </div>

                        {/* Trade Stages */}
                        <div className="space-y-4">
                          
                          {/* Planning Phase */}
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded bg-brand-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Activity className="w-3.5 h-3.5 text-brand-amber" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold uppercase text-brand-amber tracking-wider mb-1">1. Planning & Analysis</p>
                              <p className="text-xs text-white/70">
                                {trade.trading_plans ? `Pre-trade plan created for ${trade.trading_plans.setup}. Bias was ${trade.trading_plans.bias}.` : "Spontaneous trade execution with no pre-defined plan."}
                              </p>
                            </div>
                          </div>

                          {/* Execution Phase */}
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Target className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold uppercase text-blue-500 tracking-wider mb-1">2. Execution & Management</p>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div><span className="text-[10px] text-white/40 block">Entry</span><span className="text-xs font-mono">{trade.entry_price}</span></div>
                                <div><span className="text-[10px] text-white/40 block">Stop</span><span className="text-xs font-mono">{trade.stop_loss}</span></div>
                                <div><span className="text-[10px] text-white/40 block">Target</span><span className="text-xs font-mono">{trade.take_profit}</span></div>
                              </div>
                            </div>
                          </div>

                          {/* Post Trade / Mistakes */}
                          {trade.mistakes && (Array.isArray(trade.mistakes) ? trade.mistakes.length > 0 && trade.mistakes[0] !== "None detected" : true) && (
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase text-rose-500 tracking-wider mb-1">3. AI Mistake Detection</p>
                                <ul className="list-disc list-inside text-xs text-rose-400">
                                  {(Array.isArray(trade.mistakes) ? trade.mistakes : [trade.mistakes]).map((m:any, i:number) => <li key={i}>{m}</li>)}
                                </ul>
                              </div>
                            </div>
                          )}
                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
