"use client";

import React, { useState } from "react";
import { Plus, ListFilter, CheckCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JournalPage() {
  const [view, setView] = useState<"list" | "entry">("entry");

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Trading Journal</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Trade Log & Analysis</p>
        </div>
        <div className="flex gap-1 bg-[#0a0a0a] p-1 rounded border border-white/[0.04]">
          <button 
            onClick={() => setView("list")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5",
              view === "list" ? "bg-white/5 text-brand-amber border border-white/[0.04]" : "text-white/40 hover:text-white/90"
            )}
          >
            <ListFilter size={14} /> Trades
          </button>
          <button 
            onClick={() => setView("entry")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5",
              view === "entry" ? "bg-white/5 text-brand-amber border border-white/[0.04]" : "text-white/40 hover:text-white/90"
            )}
          >
            <Plus size={14} /> Log Entry
          </button>
        </div>
      </div>

      {view === "entry" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 space-y-4">
            
            {/* Trade Details */}
            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Trade Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Date</label>
                  <input type="date" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Time</label>
                  <input type="time" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Pair</label>
                  <input type="text" placeholder="EUR/USD" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono placeholder:text-white/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Direction</label>
                  <select className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 appearance-none">
                    <option>Long</option>
                    <option>Short</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Execution */}
            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Execution</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Entry Price</label>
                  <input type="number" step="0.00001" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Stop Loss</label>
                  <input type="number" step="0.00001" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Take Profit</label>
                  <input type="number" step="0.00001" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Exit Price</label>
                  <input type="number" step="0.00001" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Lot Size</label>
                  <input type="number" step="0.01" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Risk Amount ($)</label>
                  <input type="number" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
              </div>
            </div>

            {/* Psychology & Review */}
            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04] space-y-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.04] pb-2">Psychology & Review</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider">During Trade</h4>
                  {[
                    "Followed Trading Plan",
                    "Moved Stop Loss?",
                    "Closed Early?",
                    "Added Position?",
                    "Felt FOMO?",
                    "Revenge Traded?"
                  ].map((q) => (
                    <label key={q} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="w-3.5 h-3.5 rounded-sm border border-white/[0.1] group-hover:border-brand-amber/50 flex items-center justify-center transition-colors bg-[#111]">
                        <input type="checkbox" className="hidden peer" />
                        <CheckCircle size={10} className="text-brand-amber opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[11px] text-white/60 group-hover:text-white/90 tracking-wide">{q}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Emotions</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Confidence</label>
                      <span className="text-[10px] font-mono text-white/60">8/10</span>
                    </div>
                    <input type="range" min="1" max="10" defaultValue={8} className="w-full accent-brand-amber h-1 bg-[#111] rounded appearance-none" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Stress</label>
                      <span className="text-[10px] font-mono text-white/60">3/10</span>
                    </div>
                    <input type="range" min="1" max="10" defaultValue={3} className="w-full accent-brand-orange h-1 bg-[#111] rounded appearance-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">What went well?</label>
                  <textarea className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 min-h-[60px] resize-y" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Mistakes & Lessons</label>
                  <textarea className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 min-h-[60px] resize-y" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar for Entry */}
          <div className="space-y-4">
            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Trade Result</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button className="py-1.5 rounded bg-white/[0.02] border border-emerald-500/20 text-emerald-500 text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-500/10 transition-colors">Win</button>
                <button className="py-1.5 rounded bg-white/[0.02] border border-rose-500/20 text-rose-500 text-[11px] font-bold uppercase tracking-wider hover:bg-rose-500/10 transition-colors">Loss</button>
                <button className="py-1.5 rounded bg-white/[0.02] border border-slate-500/20 text-slate-400 text-[11px] font-bold uppercase tracking-wider hover:bg-slate-500/10 transition-colors">Break Even</button>
                <button className="py-1.5 rounded bg-white/[0.02] border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider hover:bg-blue-500/10 transition-colors">Partial</button>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Net P/L ($)</label>
                <input type="number" className="w-full bg-[#111] border border-white/[0.06] rounded px-3 py-2 font-mono font-bold text-lg focus:outline-none focus:border-brand-amber/50" placeholder="$0.00" />
              </div>
            </div>

            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Media</h3>
              <div className="border border-dashed border-white/[0.1] rounded bg-white/[0.01] p-6 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] hover:border-brand-amber/30 transition-all cursor-pointer group">
                <Upload size={16} className="text-white/30 group-hover:text-brand-amber transition-colors mb-2" />
                <p className="font-semibold text-xs text-white/70">Upload Chart</p>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">Drag & drop</p>
              </div>
            </div>
            
            <button className="w-full py-2.5 rounded bg-brand-amber text-[#0a0a0a] font-bold text-sm uppercase tracking-wider hover:bg-brand-amber/90 transition-all">
              Save Trade
            </button>
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="bg-[#0a0a0a] rounded-lg border border-white/[0.04]">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
            <h3 className="text-sm font-semibold text-white/90 tracking-wide">Trade History</h3>
            <div className="flex gap-2">
              <select className="bg-[#111] border border-white/[0.06] rounded px-2.5 py-1 text-xs focus:outline-none focus:border-brand-amber/50 appearance-none text-white/70">
                <option>All Pairs</option>
                <option>EUR/USD</option>
                <option>XAU/USD</option>
              </select>
              <select className="bg-[#111] border border-white/[0.06] rounded px-2.5 py-1 text-xs focus:outline-none focus:border-brand-amber/50 appearance-none text-white/70">
                <option>All Results</option>
                <option>Wins</option>
                <option>Losses</option>
              </select>
            </div>
          </div>
          <div className="p-8 text-center text-white/40 text-xs">
            <p>Your logged trades will appear here in a ledger format.</p>
          </div>
        </div>
      )}

    </div>
  );
}
