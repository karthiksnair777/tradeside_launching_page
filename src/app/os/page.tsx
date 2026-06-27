"use client";

import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Crosshair, 
  Activity, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Flame,
  ShieldAlert
} from "lucide-react";
import { StatCard } from "@/components/os/StatCard";
import { ChartWidget } from "@/components/os/ChartWidget";
import { AICoachPanel } from "@/components/os/AICoachPanel";
import { kpiStats, mockEquityCurve, mockTrades } from "@/lib/mock-data";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
} from "recharts";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Dashboard</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Performance Overview</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white/5 text-white/70 text-xs font-medium rounded hover:bg-white/10 transition-colors border border-white/[0.04]">
            Export Data
          </button>
          <button className="px-3 py-1.5 bg-brand-amber text-[#0a0a0a] text-xs font-bold rounded hover:bg-brand-amber/90 transition-colors">
            + New Trade
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <StatCard 
          title="Account Balance" 
          value={kpiStats.balance} 
          icon={DollarSign} 
          trend="up" 
          trendValue="4.2%" 
          className="xl:col-span-1"
        />
        <StatCard 
          title="Total P/L" 
          value={kpiStats.totalPnL} 
          icon={TrendingUp} 
          className="xl:col-span-1"
        />
        <StatCard 
          title="Win Rate" 
          value={kpiStats.winRate} 
          icon={Crosshair} 
          trend="up" 
          trendValue="2.1%" 
          className="xl:col-span-1"
        />
        <StatCard 
          title="Profit Factor" 
          value={kpiStats.profitFactor} 
          icon={Activity} 
          className="xl:col-span-1"
        />
        <StatCard 
          title="Drawdown" 
          value={kpiStats.drawdown} 
          icon={TrendingDown} 
          className="xl:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Main Content Area */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-4">
          
          {/* Equity Curve */}
          <ChartWidget title="Equity Curve" height={300}>
            <AreaChart data={mockEquityCurve} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb800" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ffb800" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}
                itemStyle={{ color: '#ffb800' }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#ffb800" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                animationDuration={1000}
              />
            </AreaChart>
          </ChartWidget>

          {/* Recent Trades Ledger */}
          <div className="bg-[#0a0a0a] rounded-lg border border-white/[0.04]">
            <div className="px-4 py-3 border-b border-white/[0.04] flex justify-between items-center">
              <h3 className="text-sm font-semibold tracking-wide text-white/90">Trade Ledger</h3>
              <button className="text-xs text-white/40 hover:text-white/90 transition-colors uppercase tracking-widest font-medium">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Date/Pair</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium">Setup</th>
                    <th className="px-4 py-2.5 font-medium text-right">Risk</th>
                    <th className="px-4 py-2.5 font-medium text-right">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {mockTrades.slice(0, 5).map((trade) => (
                    <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-white/90">{trade.pair}</div>
                        <div className="text-[10px] text-white/40 font-mono">{trade.date} {trade.time}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest",
                          trade.direction === "Long" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        )}>
                          {trade.direction}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-white/60">{trade.setup}</td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        <div className="text-white/80">${trade.risk}</div>
                        <div className="text-[10px] text-white/40">1:{trade.rr}</div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        <div className={cn(
                          "font-bold",
                          trade.result === "Win" ? "text-emerald-500" :
                          trade.result === "Loss" ? "text-rose-500" : "text-white/50"
                        )}>
                          {trade.profit > 0 ? "+" : ""}{trade.profit === 0 ? "BE" : `$${Math.abs(trade.profit)}`}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <AICoachPanel />
          
          <div className="bg-[#0a0a0a] border border-white/[0.04] p-5 rounded-lg">
            <h3 className="text-sm font-semibold tracking-wide text-white/90 mb-4">Today's Status</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded bg-white/[0.02] border border-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Target size={12} className="text-white/40" />
                  <span className="text-xs text-white/60 uppercase tracking-widest">Bias</span>
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Bullish</span>
              </div>
              
              <div className="flex justify-between items-center p-2 rounded bg-white/[0.02] border border-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-white/40" />
                  <span className="text-xs text-white/60 uppercase tracking-widest">Session</span>
                </div>
                <span className="text-xs font-bold text-white/90 uppercase tracking-wider">New York</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-white/[0.02] border border-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Flame size={12} className="text-white/40" />
                  <span className="text-xs text-white/60 uppercase tracking-widest">Mood</span>
                </div>
                <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Focused</span>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-[10px] mb-1.5 uppercase tracking-widest font-semibold">
                <span className="text-white/40 flex items-center gap-1"><ShieldAlert size={10}/> Risk Limit</span>
                <span className="text-white/90 font-mono">1.5% / 2.0%</span>
              </div>
              <div className="w-full bg-white/[0.04] rounded-sm h-1.5">
                <div className="bg-brand-amber h-1.5 rounded-sm" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
