"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { insforge } from "@/lib/insforge";
import { Beaker, TrendingUp, TrendingDown, Crosshair, Award, PieChart as PieChartIcon, BarChart3, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, Rectangle
} from "recharts";
import { ChartWidget } from "@/components/os/ChartWidget";

export default function DetailedAnalyticsPage() {
  const { activeAccount } = useAccount();
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [overview, setOverview] = useState({
    totalTrades: 0,
    winRate: 0,
    profitFactor: 0,
    netPnl: 0,
  });

  const [charts, setCharts] = useState({
    equityCurve: [] as any[],
    winLoss: [] as any[],
    sessions: [] as any[],
    pairs: [] as any[]
  });

  useEffect(() => {
    fetchData();
  }, [activeAccount]);

  const fetchData = async () => {
    if (!activeAccount) return;
    setLoading(true);
    try {
      const { data: trades } = await insforge.database
        .from("trades")
        .select("*")
        .eq("account_id", activeAccount.id)
        .order("created_at", { ascending: true }); // Ascending for equity curve

      if (trades && trades.length > 0) {
        
        // --- Strategy Table Data ---
        const strategyMap = new Map();
        trades.forEach(trade => {
          const setup = trade.setup || "Unplanned";
          if (!strategyMap.has(setup)) {
            strategyMap.set(setup, { name: setup, trades: 0, wins: 0, profit: 0, loss: 0, totalRisk: 0, execScores: [] });
          }
          const s = strategyMap.get(setup);
          s.trades += 1;
          const profit = Number(trade.profit || 0);
          if (trade.result === 'Win') s.wins += 1;
          if (profit > 0) s.profit += profit;
          else s.loss += Math.abs(profit);
          s.totalRisk += Number(trade.risk || 1);
          if (trade.score_overall) s.execScores.push(trade.score_overall);
        });

        const stats = Array.from(strategyMap.values()).map(s => {
          s.winRate = (s.wins / s.trades) * 100;
          s.profitFactor = s.loss > 0 ? (s.profit / s.loss) : (s.profit > 0 ? s.profit : 0);
          s.avgExecScore = s.execScores.length ? s.execScores.reduce((a:number,b:number)=>a+b,0) / s.execScores.length : 0;
          s.netPnl = s.profit - s.loss;
          return s;
        }).sort((a,b) => b.netPnl - a.netPnl);
        
        setStrategies(stats);

        // --- Overview Metrics ---
        const wins = trades.filter((t:any) => t.result === 'Win').length;
        const totalProfit = trades.reduce((acc:number, t:any) => acc + (t.profit > 0 ? t.profit : 0), 0);
        const totalLoss = trades.reduce((acc:number, t:any) => acc + (t.profit < 0 ? Math.abs(t.profit) : 0), 0);
        const netPnl = totalProfit - totalLoss;
        
        setOverview({
          totalTrades: trades.length,
          winRate: (wins / trades.length) * 100,
          profitFactor: totalLoss > 0 ? (totalProfit / totalLoss) : totalProfit,
          netPnl: netPnl
        });

        // --- Charts Data ---
        
        // 1. Equity Curve
        let cumulative = activeAccount.initial_balance;
        const equityCurve = [{ date: 'Start', equity: cumulative }];
        trades.forEach(t => {
          cumulative += (t.profit || 0);
          equityCurve.push({ date: t.date, equity: cumulative });
        });

        // 2. Win/Loss Distribution
        const losses = trades.filter((t:any) => t.result === 'Loss').length;
        const breakEvens = trades.filter((t:any) => t.result === 'Break Even').length;
        const winLoss = [
          { name: 'Wins', value: wins, fill: '#10b981' }, // emerald-500
          { name: 'Losses', value: losses, fill: '#f43f5e' }, // rose-500
          { name: 'Break Even', value: breakEvens, fill: '#71717a' } // zinc-500
        ].filter(d => d.value > 0);

        // 3. Session Data
        const sessionMap = new Map();
        trades.forEach(t => {
          const sess = t.session || 'Unknown';
          if (!sessionMap.has(sess)) sessionMap.set(sess, { session: sess, profit: 0 });
          sessionMap.get(sess).profit += (t.profit || 0);
        });
        const sessions = Array.from(sessionMap.values());

        // 4. Pair Data
        const pairMap = new Map();
        trades.forEach(t => {
          const pair = t.pair?.toUpperCase() || 'Unknown';
          if (!pairMap.has(pair)) pairMap.set(pair, { pair, profit: 0 });
          pairMap.get(pair).profit += (t.profit || 0);
        });
        const pairs = Array.from(pairMap.values()).sort((a,b) => b.profit - a.profit).slice(0, 5); // top 5 pairs

        setCharts({ equityCurve, winLoss, sessions, pairs });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-white/50 text-[10px] uppercase font-bold mb-1">{label}</p>
          <p className="text-brand-amber font-mono font-bold">
            ${Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-black text-white space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Advanced Analytics</h1>
        <p className="text-gray-400">Deep-dive into your performance data, strategy edge, and equity curve.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-white/50 animate-pulse">Crunching analytical data...</div>
      ) : strategies.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-white/50 border border-white/5 rounded-2xl bg-[#0a0a0a]">
          <BarChart3 className="w-12 h-12 mb-4 text-white/20" />
          <p>No trade data found. Log your first trade in the Journal to generate analytics.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Overview Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Trades</h3>
              <p className="text-3xl font-black text-white/90 font-mono">{overview.totalTrades}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Win Rate</h3>
              <p className="text-3xl font-black text-white/90 font-mono">{overview.winRate.toFixed(1)}%</p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Profit Factor</h3>
              <p className="text-3xl font-black text-white/90 font-mono">{overview.profitFactor.toFixed(2)}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <TrendingUp size={60} />
              </div>
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Net P/L</h3>
              <p className={`text-3xl font-black font-mono ${overview.netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {overview.netPnl >= 0 ? '+' : '-'}${Math.abs(overview.netPnl).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Equity Curve */}
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 h-[350px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={16} className="text-brand-amber" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">Equity Curve</h3>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.equityCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEquityAnalytics" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffb800" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ffb800" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(val) => `$${val}`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="equity" stroke="#ffb800" strokeWidth={3} fillOpacity={1} fill="url(#colorEquityAnalytics)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Win/Loss Distribution */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 h-[350px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon size={16} className="text-brand-amber" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">Win/Loss Distribution</h3>
              </div>
              <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.winLoss}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {charts.winLoss.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-white/90">{overview.totalTrades}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Trades</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Session Performance */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 h-[300px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-blue-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">P/L by Session</h3>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.sessions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="session" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                    <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                      {charts.sessions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#f43f5e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Pairs */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 h-[300px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">Top 5 Pairs by P/L</h3>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.pairs} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                    <YAxis dataKey="pair" type="category" stroke="rgba(255,255,255,0.6)" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                    <Bar dataKey="profit" radius={[0, 4, 4, 0]} barSize={20}>
                      {charts.pairs.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#ffb800' : '#f43f5e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Strategy Breakdown Table (Original component) */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl mt-8">
            <div className="p-5 border-b border-white/[0.04] flex gap-2 items-center">
              <Crosshair size={16} className="text-white/40" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">Strategy / Setup Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/[0.04] bg-[#111]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Strategy / Setup</th>
                    <th className="px-6 py-4 font-medium text-center">Trades</th>
                    <th className="px-6 py-4 font-medium text-center">Win Rate</th>
                    <th className="px-6 py-4 font-medium text-center">Profit Factor</th>
                    <th className="px-6 py-4 font-medium text-center">Exec Score</th>
                    <th className="px-6 py-4 font-medium text-right">Net P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {strategies.map((strategy, idx) => (
                    <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={idx} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white/90">{strategy.name}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono text-white/70">{strategy.trades}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono font-bold text-white/90">{strategy.winRate.toFixed(1)}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono font-bold text-white/90">{strategy.profitFactor.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2 py-1 rounded bg-brand-amber/10 text-brand-amber font-mono text-xs font-bold border border-brand-amber/20">
                          {Math.round(strategy.avgExecScore)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={strategy.netPnl > 0 ? "text-emerald-500 font-bold font-mono" : strategy.netPnl < 0 ? "text-rose-500 font-bold font-mono" : "text-white/50 font-bold font-mono"}>
                          {strategy.netPnl > 0 ? "+" : ""}${Math.abs(strategy.netPnl).toFixed(2)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
