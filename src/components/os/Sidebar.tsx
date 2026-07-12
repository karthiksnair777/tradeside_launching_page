"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  LineChart, 
  Target, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Dna,
  BookX,
  Target as TargetGoal,
  FileText,
  ChevronDown,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccount } from "@/contexts/AccountContext";
import { AccountManager } from "./AccountManager";
import { useSidebar } from "@/contexts/SidebarContext";

const navItems = [
  { name: "Dashboard", href: "/os", icon: LayoutDashboard },
  { name: "Plan Builder", href: "/os/plan", icon: Target },
  { name: "Journal", href: "/os/journal", icon: BookOpen },
  { name: "Calendar", href: "/os/calendar", icon: Calendar },
  { name: "Daily Mission", href: "/os/goals", icon: TargetGoal },
  { name: "Strategy Lab", href: "/os/analytics", icon: LineChart },
  { name: "Trading DNA", href: "/os/playbook/dna", icon: Dna },
  { name: "Psychology", href: "/os/psychology", icon: Brain },
  { name: "Mistakes", href: "/os/mistakes", icon: BookX },
  { name: "Rule Engine", href: "/os/rules", icon: Shield },
  { name: "AI Review", href: "/os/reports/weekly", icon: FileText },
  { name: "Settings", href: "/os/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showAccountManager, setShowAccountManager] = useState(false);
  const { activeAccount } = useAccount();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-[100dvh] border-r border-white/[0.04] bg-[#050505] transition-transform duration-300 flex flex-col md:translate-x-0 shadow-2xl md:shadow-none",
        collapsed ? "w-16" : "w-64 md:w-56",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b border-white/[0.04]">
        {!collapsed && (
          <Link href="/os" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-brand-amber/10 flex items-center justify-center text-brand-amber font-bold text-xs border border-brand-amber/20">
              T
            </div>
            <span className="font-bold text-sm tracking-tight text-white/90">Tradeside OS</span>
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
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon 
                size={14} 
                className={cn(
                  "transition-colors shrink-0",
                  finalActive ? "text-brand-amber" : "text-white/40 group-hover:text-white/70"
                )} 
              />
              {!collapsed && (
                <span className="font-medium text-xs tracking-wide">{item.name}</span>
              )}
              
              {finalActive && (
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-brand-amber rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-3 border-t border-white/[0.04]">
        {!collapsed ? (
          <button 
            onClick={() => setShowAccountManager(true)}
            className="w-full bg-[#0a0a0a] border border-white/[0.04] hover:bg-white/[0.02] hover:border-white/10 transition-colors p-2.5 rounded-md flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2 overflow-hidden">
               <div className="w-2 h-2 shrink-0 rounded-full bg-brand-amber shadow-[0_0_8px_#ffb800] animate-pulse"></div>
               <div className="min-w-0">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest leading-none mb-1">Active Account</p>
                  <p className="text-xs font-semibold text-white/90 leading-none truncate">
                    {activeAccount ? activeAccount.name : "No Account"}
                  </p>
               </div>
            </div>
            <ChevronDown size={14} className="text-white/30 group-hover:text-white/60 shrink-0" />
          </button>
        ) : (
          <button 
            onClick={() => setShowAccountManager(true)}
            className="w-full bg-[#0a0a0a] border border-white/[0.04] hover:bg-white/[0.02] hover:border-white/10 transition-colors p-2.5 rounded-md flex items-center justify-center group"
            title={activeAccount ? activeAccount.name : "No Account"}
          >
            <div className="w-2 h-2 shrink-0 rounded-full bg-brand-amber shadow-[0_0_8px_#ffb800] animate-pulse"></div>
          </button>
        )}
      </div>

      {showAccountManager && <AccountManager onClose={() => setShowAccountManager(false)} />}
    </aside>
    </>
  );
}
