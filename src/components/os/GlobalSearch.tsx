"use client";

import React, { useState } from "react";
import { Search, Command } from "lucide-react";

export function GlobalSearch() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-sm hidden md:block">
      <div 
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border transition-colors bg-[#0a0a0a]
          ${isFocused ? "border-brand-amber/50 bg-[#111]" : "border-white/[0.06]"}`}
      >
        <Search size={14} className="text-white/40" />
        <input 
          type="text" 
          placeholder="Search trades, tags, or notes..." 
          className="bg-transparent border-none outline-none text-xs w-full placeholder:text-white/30 text-white/90 font-medium"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="flex items-center gap-1 text-[9px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 tracking-wider font-mono">
          <Command size={9} />
          <span>K</span>
        </div>
      </div>
    </div>
  );
}
