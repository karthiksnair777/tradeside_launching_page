import React from "react";
import { Brain, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

export function AICoachPanel() {
  return (
    <div className="bg-[#0a0a0a] border border-brand-amber/10 p-5 rounded-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none group-hover:bg-brand-amber/10 transition-all duration-700"></div>
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="w-8 h-8 rounded bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center text-brand-amber">
          <Brain size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold flex items-center gap-1.5 text-white/90">
            AI Trading Coach
            <Sparkles size={12} className="text-brand-amber" />
          </h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Weekly Insights</p>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-start gap-2.5">
            <TrendingUp size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold mb-1 text-white/90">London Session Optimization</p>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Trades taken during London session have a <strong className="text-white/80 font-mono">72%</strong> win rate. Increase allocation during this window.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={14} className="text-brand-orange mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold mb-1 text-white/90">Post-Loss Drawdowns</p>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Entries within 30m of a loss result in <strong className="text-brand-orange font-mono">45%</strong> larger drawdowns. Implement a 1h cool-off.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
