"use client";

import React, { useEffect, useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Crosshair, 
  Activity, 
  Clock, 
  Target,
  Flame,
  ShieldAlert
} from "lucide-react";
import { StatCard } from "@/components/os/StatCard";
import { ChartWidget } from "@/components/os/ChartWidget";
import { AICoachPanel } from "@/components/os/AICoachPanel";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
} from "recharts";
import { cn } from "@/lib/utils";
import { insforge } from "@/lib/insforge";
import { useAccount } from "@/contexts/AccountContext";

export default function DashboardPage() {
  const { activeAccount } = useAccount();
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Computed KPIs
  const [kpis, setKpis] = useState({
    balance: "$0.00",
    totalPnL: "$0.00",
    winRate: "0%",
    profitFactor: "0.00",
    drawdown: "0.0%",
    curve: [] as any[]
  });

  useEffect(() => {
    async function loadData() {
      if (!activeAccount) {
        setTrades([]);
        setKpis({ balance: "$0.00", totalPnL: "$0.00", winRate: "0%", profitFactor: "0.00", drawdown: "0.0%", curve: [] });
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await insforge.database
        .from("trades")
        .select("*")
        .eq("account_id", activeAccount.id)
        .order("created_at", { ascending: true });
        
      if (!error && data) {
        setTrades(data.reverse()); // Store latest first for the table
        
        // Calculate KPIs
        let balance = Number(activeAccount.initial_balance);
        let wins = 0;
        let grossProfit = 0;
        let grossLoss = 0;
        let peak = balance;
        let maxDrawdown = 0;
        
        const curve = [{ date: "Start", balance }];

        // Re-reverse for chronological calculation
        [...data].forEach(t => {
          const pnl = Number(t.profit || 0);
          balance += pnl;
          
          if (pnl > 0) {
            wins++;
            grossProfit += pnl;
          } else {
            grossLoss += Math.abs(pnl);
          }
          
          if (balance > peak) peak = balance;
          const currentDd = ((peak - balance) / peak) * 100;
          if (currentDd > maxDrawdown) maxDrawdown = currentDd;

          curve.push({ date: t.date ? t.date.substring(5) : "", balance });
        });

        setKpis({
          balance: `$${balance.toLocaleString()}`,
          totalPnL: `${balance - activeAccount.initial_balance >= 0 ? "+" : "-"} $${Math.abs(balance - activeAccount.initial_balance).toLocaleString()}`,
          winRate: data.length ? `${Math.round((wins / data.length) * 100)}%` : "0%",
          profitFactor: grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? "MAX" : "0.00"),
          drawdown: `${maxDrawdown.toFixed(1)}%`,
          curve: curve.length > 1 ? curve : [{ date: "No data", balance: activeAccount.initial_balance }]
        });
      }
      setLoading(false);
    }
    loadData();
  }, [activeAccount]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Dashboard</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Performance Overview</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-brand-amber text-[#0a0a0a] text-xs font-bold rounded hover:bg-brand-amber/90 transition-colors">
            + New Trade
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <StatCard title="Account Balance" value={kpis.balance} icon={DollarSign} className="xl:col-span-1" />
        <StatCard title="Total P/L" value={kpis.totalPnL} icon={TrendingUp} className="xl:col-span-1" />
        <StatCard title="Win Rate" value={kpis.winRate} icon={Crosshair} className="xl:col-span-1" />
        <StatCard title="Profit Factor" value={kpis.profitFactor} icon={Activity} className="xl:col-span-1" />
        <StatCard title="Max Drawdown" value={kpis.drawdown} icon={TrendingDown} className="xl:col-span-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Main Content Area */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-4">
          
          {/* Equity Curve */}
          <ChartWidget title="Equity Curve" height={300}>
            <AreaChart data={kpis.curve} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb800" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ffb800" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}
                itemStyle={{ color: '#ffb800' }}
              />
              <Area type="stepAfter" dataKey="balance" stroke="#ffb800" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBalance)" animationDuration={1000} />
            </AreaChart>
          </ChartWidget>

          {/* Recent Trades Ledger */}
          <div className="bg-[#0a0a0a] rounded-lg border border-white/[0.04]">
            <div className="px-4 py-3 border-b border-white/[0.04] flex justify-between items-center">
              <h3 className="text-sm font-semibold tracking-wide text-white/90">Recent Trades</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Date/Pair</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium text-right">Risk</th>
                    <th className="px-4 py-2.5 font-medium text-right">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {trades.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-white/40">No trades recorded yet.</td>
                    </tr>
                  ) : trades.slice(0, 5).map((trade) => (
                    <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-white/90 uppercase">{trade.pair}</div>
                        <div className="text-[10px] text-white/40 font-mono">{trade.date}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest",
                          trade.direction === "Long" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        )}>
                          {trade.direction}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        <div className="text-white/80">{trade.risk_amount ? `$${trade.risk_amount}` : '-'}</div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        <div className={cn(
                          "font-bold",
                          trade.profit > 0 ? "text-emerald-500" :
                          trade.profit < 0 ? "text-rose-500" : "text-white/50"
                        )}>
                          {trade.profit > 0 ? "+" : ""}{trade.profit ? `$${Math.abs(trade.profit)}` : 'BE'}
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
                <span className="text-white/90 font-mono">0.0% / 2.0%</span>
              </div>
              <div className="w-full bg-white/[0.04] rounded-sm h-1.5">
                <div className="bg-brand-amber h-1.5 rounded-sm" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
