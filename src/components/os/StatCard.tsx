import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendValue, className }: StatCardProps) {
  return (
    <div className={cn("bg-[#0a0a0a] border border-white/[0.04] p-4 rounded-lg hover:border-white/[0.08] transition-colors group", className)}>
      <div className="flex justify-between items-start mb-3">
        <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest leading-none">{title}</p>
        {Icon && (
          <div className="text-white/30 group-hover:text-brand-amber transition-colors">
            <Icon size={14} />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <h3 className="text-xl font-bold tracking-tight font-mono text-white/90">{value}</h3>
        {trendValue && (
          <div className="text-[10px] font-medium font-mono pb-0.5">
            <span 
              className={cn(
                trend === "up" ? "text-emerald-500" : 
                trend === "down" ? "text-rose-500" : 
                "text-white/40"
              )}
            >
              {trend === "up" ? "+" : trend === "down" ? "-" : ""}{trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
