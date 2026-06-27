"use client";

import React from "react";
import { FileText, Lock } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Reports</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Export Tear Sheets</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/[0.04] p-12 rounded-lg flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-12 h-12 rounded bg-[#111] border border-white/[0.06] flex items-center justify-center text-brand-amber mb-4">
          <FileText size={20} />
        </div>
        <h2 className="text-lg font-bold text-white/90 mb-1">Reports Engine Coming Soon</h2>
        <p className="text-xs text-white/40 max-w-md mx-auto mb-6 leading-relaxed">
          Export beautiful PDF reports of your weekly, monthly, or quarterly performance to share with investors or mentors.
        </p>
        <button className="px-4 py-2 rounded bg-white/[0.02] border border-white/[0.04] flex items-center gap-2 hover:bg-white/[0.05] transition-colors cursor-not-allowed text-white/30 text-xs font-semibold uppercase tracking-wider">
          <Lock size={12} /> Locked in Beta
        </button>
      </div>
    </div>
  );
}
