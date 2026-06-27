"use client";

import React, { ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface ChartWidgetProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
  className?: string;
}

export function ChartWidget({ title, subtitle, children, height = 300, className }: ChartWidgetProps) {
  return (
    <div className={cn("bg-[#0a0a0a] border border-white/[0.04] p-5 rounded-lg flex flex-col", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-wide text-white/90">{title}</h3>
        {subtitle && <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">{subtitle}</p>}
      </div>
      
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
