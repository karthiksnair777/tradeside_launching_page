"use client";

import React from "react";
import { Settings, User, Bell, Shield, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const tabs = [
    { name: "Account", icon: User },
    { name: "Trading Preferences", icon: Wallet },
    { name: "Notifications", icon: Bell },
    { name: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Settings</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Preferences & Config</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-56 space-y-1">
          {tabs.map((tab, idx) => (
            <button 
              key={tab.name}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left",
                idx === 0 
                  ? "bg-white/[0.06] text-white" 
                  : "text-white/40 hover:bg-white/[0.02] hover:text-white/80"
              )}
            >
              <tab.icon size={14} className={idx === 0 ? "text-brand-amber" : "text-white/30"} />
              <span className="tracking-wide">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-[#0a0a0a] p-6 rounded-lg border border-white/[0.04]">
          <h3 className="text-sm font-semibold tracking-wide text-white/90 mb-6 pb-4 border-b border-white/[0.04]">Profile Settings</h3>
          
          <div className="space-y-5 max-w-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded bg-[#111] border border-white/[0.06] flex items-center justify-center text-xl font-bold text-brand-amber">
                T
              </div>
              <button className="px-3 py-1.5 bg-[#111] border border-white/[0.06] rounded text-[11px] font-semibold uppercase tracking-wider text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors">
                Change Avatar
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-white/40">Full Name</label>
                <input type="text" defaultValue="Pro Trader" className="w-full bg-[#111] border border-white/[0.06] rounded px-3 py-2 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-white/40">Email Address</label>
                <input type="email" defaultValue="trader@tradeside.com" className="w-full bg-[#111] border border-white/[0.06] rounded px-3 py-2 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-white/40">Default Account Size ($)</label>
                <input type="number" defaultValue="100000" className="w-full bg-[#111] border border-white/[0.06] rounded px-3 py-2 text-xs text-white/90 font-mono focus:outline-none focus:border-brand-amber/50" />
              </div>
            </div>

            <button className="px-4 py-2 mt-2 rounded bg-brand-amber text-[#0a0a0a] font-bold text-xs uppercase tracking-wider hover:bg-brand-amber/90 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
