"use client";

import React from "react";
import { ChartWidget } from "@/components/os/ChartWidget";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
} from "recharts";
import { mockPerformanceBySession, mockWinRateData } from "@/lib/mock-data";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Analytics</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Advanced Metrics</p>
        </div>
        
        <div className="flex gap-2">
          <select className="bg-[#0a0a0a] border border-white/[0.04] rounded px-3 py-1.5 text-xs text-white/70 font-semibold uppercase tracking-wider focus:outline-none focus:border-brand-amber/50 appearance-none">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* Advanced Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Best Pair", value: "EUR/USD", sub: "+$4,500" },
          { label: "Worst Pair", value: "GBP/JPY", sub: "-$850" },
          { label: "Best Session", value: "London", sub: "72% WR" },
          { label: "Expectancy", value: "$45.20", sub: "Per Trade" },
          { label: "Largest Win", value: "$1,500", sub: "XAU/USD" },
          { label: "Largest Loss", value: "-$450", sub: "US30" },
          { label: "Avg Hold Time", value: "2h 45m", sub: "Intraday" },
          { label: "Sharpe Ratio", value: "1.8", sub: "Excellent" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] p-3 rounded-lg border border-white/[0.04]">
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="font-bold text-sm font-mono text-white/90">{stat.value}</p>
            <p className="text-[10px] text-brand-amber font-mono font-medium mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Session Performance */}
        <ChartWidget title="Session Performance" subtitle="Win rate & profitability" height={260}>
          <BarChart data={mockPerformanceBySession} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="session" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
            <YAxis yAxisId="left" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="rgba(16,185,129,0.3)" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}
            />
            <Bar yAxisId="left" dataKey="winRate" fill="#ffb800" radius={[2, 2, 0, 0]} name="Win Rate %" maxBarSize={40} />
            <Bar yAxisId="right" dataKey="profit" fill="#10b981" radius={[2, 2, 0, 0]} name="Profit ($)" maxBarSize={40} />
          </BarChart>
        </ChartWidget>

        {/* Setup Distribution */}
        <ChartWidget title="Trade Outcomes" subtitle="Win / Loss Ratio" height={260}>
          <PieChart>
            <Pie
              data={mockWinRateData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {mockWinRateData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}
              itemStyle={{ color: '#fff' }}
            />
            <text x="50%" y="45%" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" fontFamily="monospace">
              65%
            </text>
            <text x="50%" y="55%" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" textLength="60" textAnchor="middle">
              WIN RATE
            </text>
          </PieChart>
        </ChartWidget>

      </div>
    </div>
  );
}
