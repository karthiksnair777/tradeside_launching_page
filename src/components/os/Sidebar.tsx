"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  LineChart, 
  Brain, 
  BookMarked, 
  Target, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/os", icon: LayoutDashboard },
  { name: "Journal", href: "/os/journal", icon: BookOpen },
  { name: "Calendar", href: "/os/calendar", icon: Calendar },
  { name: "Analytics", href: "/os/analytics", icon: LineChart },
  { name: "Psychology", href: "/os/psychology", icon: Brain },
  { name: "Playbook", href: "/os/playbook", icon: BookMarked },
  { name: "Goals", href: "/os/goals", icon: Target },
  { name: "Reports", href: "/os/reports", icon: FileText },
  { name: "Settings", href: "/os/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 border-r border-white/[0.04] bg-[#050505] transition-all duration-300 flex flex-col z-40",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b border-white/[0.04]">
        {!collapsed && (
          <Link href="/os" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-brand-amber/10 flex items-center justify-center text-brand-amber font-bold text-xs border border-brand-amber/20">
              T
            </div>
            <span className="font-bold text-sm tracking-tight text-white/90">Journal OS</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/os" className="mx-auto">
            <div className="w-6 h-6 rounded-sm bg-brand-amber/10 flex items-center justify-center text-brand-amber font-bold text-xs border border-brand-amber/20">
              T
            </div>
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded text-white/40 hover:text-white/90 hover:bg-white/5 transition-colors absolute -right-3 top-4 bg-[#0a0a0a] border border-white/[0.08] hidden md:block"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isExactActive = pathname === "/os" && item.href === "/os";
          const finalActive = item.href === "/os" ? isExactActive : isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors group relative",
                finalActive 
                  ? "bg-white/[0.06] text-white" 
                  : "text-white/50 hover:text-white/90 hover:bg-white/[0.02]"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon 
                size={14} 
                className={cn(
                  "transition-colors",
                  finalActive ? "text-brand-amber" : "text-white/40 group-hover:text-white/70"
                )} 
              />
              {!collapsed && (
                <span className="font-medium text-xs tracking-wide">{item.name}</span>
              )}
              
              {/* Active Indicator Line */}
              {finalActive && (
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-brand-amber rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>
      
      {!collapsed && (
        <div className="p-3 border-t border-white/[0.04]">
          <div className="bg-[#0a0a0a] border border-white/[0.04] p-2.5 rounded-md flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-brand-amber shadow-[0_0_8px_#ffb800]"></div>
             <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest leading-none mb-1">Plan</p>
                <p className="text-xs font-semibold text-white/90 leading-none">Pro Trader</p>
             </div>
          </div>
        </div>
      )}
    </aside>
  );
}
