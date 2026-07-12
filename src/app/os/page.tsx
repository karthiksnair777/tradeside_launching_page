"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { insforge } from "@/lib/insforge";
import { StatCard } from "@/components/os/StatCard";
import { ChartWidget } from "@/components/os/ChartWidget";
import { PropFirmWidget } from "@/components/os/PropFirmWidget";
import { ArrowUpRight, ArrowDownRight, Target, Shield, Brain, Activity, TrendingUp, TrendingDown, Clock, BarChart3, ArrowUp, ArrowDown, Flame, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OSDashboard() {
  const { activeAccount } = useAccount();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"overall" | "today">("overall");

  useEffect(() => {
    fetchDashboardStats();
  }, [activeAccount]);

  const fetchDashboardStats = async () => {
    if (!activeAccount) return;
    setLoading(true);
    try {
      const { data: trades } = await insforge.database
        .from("trades")
        .select("*")
        .eq("account_id", activeAccount.id)
        .order("created_at", { ascending: false });

      if (trades && trades.length > 0) {
        const wins = trades.filter((t:any) => t.result === 'Win');
        const losses = trades.filter((t:any) => t.result === 'Loss');
        const winRate = (wins.length / trades.length) * 100;
        
        const totalProfit = trades.reduce((acc:number, t:any) => acc + (t.profit > 0 ? t.profit : 0), 0);
        const totalLoss = trades.reduce((acc:number, t:any) => acc + (t.profit < 0 ? Math.abs(t.profit) : 0), 0);
        const profitFactor = totalLoss > 0 ? (totalProfit / totalLoss) : totalProfit;
        const netPnl = totalProfit - totalLoss;
        
        const execScores = trades.map((t:any) => t.score_overall).filter(Boolean);
        const avgExec = execScores.length ? execScores.reduce((a:number,b:number)=>a+b,0) / execScores.length : 0;
        
        // Mock current streak
        let streak = 0;
        let streakType = trades[0].result;
        for (let t of trades) {
          if (t.result === streakType) streak++;
          else break;
        }

        // Chart Data
        let cumulative = activeAccount.initial_balance;
        const chartData = trades.slice().reverse().map((t:any) => {
          cumulative += (t.profit || 0);
          return {
            date: t.date || 'Start',
            equity: cumulative
          };
        });

        // Today's Stats
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysTrades = trades.filter((t:any) => t.date === todayStr);
        const todaysPnl = todaysTrades.reduce((acc:number, t:any) => acc + (t.profit || 0), 0);
        const todaysWins = todaysTrades.filter((t:any) => t.result === 'Win').length;
        const todaysLosses = todaysTrades.filter((t:any) => t.result === 'Loss').length;

        // Performance Analysis (Gross Profit/Loss, Avg Win/Loss, Avg RR)
        const winningTrades = trades.filter((t:any) => t.profit > 0);
        const losingTrades = trades.filter((t:any) => t.profit < 0);
        const grossProfit = winningTrades.reduce((acc:number, t:any) => acc + t.profit, 0);
        const grossLoss = losingTrades.reduce((acc:number, t:any) => acc + Math.abs(t.profit), 0);
        const avgWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
        const avgLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;
        const avgRR = avgLoss > 0 ? avgWin / avgLoss : avgWin;

        // Dynamic Insights Calculation
        const pairStats: Record<string, { wins: number, losses: number, pnl: number }> = {};
        trades.forEach((t:any) => {
          if (!t.pair) return;
          const p = t.pair.toUpperCase();
          if (!pairStats[p]) pairStats[p] = { wins: 0, losses: 0, pnl: 0 };
          if (t.result === 'Win') pairStats[p].wins++;
          else if (t.result === 'Loss') pairStats[p].losses++;
          pairStats[p].pnl += (t.profit || 0);
        });
        
        let bestPair = "N/A";
        let worstPair = "N/A";
        let bestPairWinRate = 0;
        let maxPnl = -Infinity;
        let minPnl = Infinity;

        Object.keys(pairStats).forEach(p => {
          const s = pairStats[p];
          if (s.pnl > maxPnl) { maxPnl = s.pnl; bestPair = p; bestPairWinRate = Math.round((s.wins / (s.wins + s.losses)) * 100); }
          if (s.pnl < minPnl) { minPnl = s.pnl; worstPair = p; }
        });

        // Today's Status Dynamic Data
        let todaysBias = "NEUTRAL";
        let todaysSession = "N/A";
        let todaysMood = "FOCUSED";
        let todaysRiskLimit = 0;

        if (todaysTrades.length > 0) {
          const longs = todaysTrades.filter((t:any) => t.direction === 'Long').length;
          const shorts = todaysTrades.filter((t:any) => t.direction === 'Short').length;
          if (longs > shorts) todaysBias = "BULLISH";
          else if (shorts > longs) todaysBias = "BEARISH";

          const sessionCounts = todaysTrades.reduce((acc:any, t:any) => {
            acc[t.session] = (acc[t.session] || 0) + 1;
            return acc;
          }, {});
          todaysSession = Object.keys(sessionCounts).sort((a,b) => sessionCounts[b] - sessionCounts[a])[0]?.toUpperCase() || "N/A";
          
          todaysMood = todaysTrades[0]?.mood?.toUpperCase() || "FOCUSED";
          
          todaysRiskLimit = todaysTrades.reduce((acc:number, t:any) => acc + ((t.risk / activeAccount.initial_balance) * 100 || 0), 0);
        }

        let improvements: string[] = [];
        if (trades.length >= 3) {
          const highStressLosses = losingTrades.filter((t:any) => t.mood === 'Stressed').length;
          if (losingTrades.length > 0 && highStressLosses / losingTrades.length > 0.4) {
            improvements.push("You experience high stress on losing trades. Consider scaling down lot size to build psychological resilience.");
          }
          
          const tradesWithMistakes = trades.filter((t:any) => t.tags && t.tags.length > 0).length;
          if (tradesWithMistakes / trades.length > 0.2) {
            improvements.push("You are recording emotional mistakes (FOMO/Revenge) frequently. Slow down execution and double-check your pre-trade checklist.");
          }

          if (improvements.length === 0) {
            improvements.push("Your execution and psychology are currently stable. Keep sticking strictly to your trading plan.");
          }
        }

        // Prepend starting balance
        chartData.unshift({ date: 'Start', equity: activeAccount.initial_balance });

        setStats({
          winRate,
          profitFactor,
          netPnl,
          avgExec,
          totalTrades: trades.length,
          streak: `${streak} ${streakType}s`,
          streakIsWin: streakType === 'Win',
          balance: activeAccount.initial_balance + netPnl,
          chartData,
          todaysTrades: todaysTrades.length,
          todaysPnl,
          todaysWins,
          todaysLosses,
          grossProfit,
          grossLoss,
          avgWin,
          avgLoss,
          avgRR,
          bestPair,
          bestPairWinRate,
          worstPair,
          todaysBias,
          todaysSession,
          todaysMood,
          todaysRiskLimit,
          recentTrades: trades.slice(0, 5),
          improvements
        });
      } else {
        setStats({
          winRate: 0, profitFactor: 0, netPnl: 0, avgExec: 0, totalTrades: 0, streak: '0', streakIsWin: true, balance: activeAccount.initial_balance, chartData: [{date: 'Start', equity: activeAccount.initial_balance}],
          todaysTrades: 0, todaysPnl: 0, todaysWins: 0, todaysLosses: 0, grossProfit: 0, grossLoss: 0, avgWin: 0, avgLoss: 0, avgRR: 0,
          bestPair: 'N/A', bestPairWinRate: 0, worstPair: 'N/A', todaysBias: 'NEUTRAL', todaysSession: 'N/A', todaysMood: 'FOCUSED', todaysRiskLimit: 0, recentTrades: [], improvements: []
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto bg-black text-white space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Institutional Dashboard</h1>
          <p className="text-sm text-white/50">Welcome back. Execute with precision today.</p>
        </div>
        {stats && (
          <div className="text-left md:text-right mt-2 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Current Balance</p>
            <p className="text-3xl font-black font-mono tracking-tight text-white/90">
              ${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </header>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-white/30 animate-pulse">Loading analytics...</div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2 bg-[#0a0a0a] w-fit p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setTimeframe("overall")}
              className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-colors", timeframe === "overall" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80")}
            >
              Overall Data
            </button>
            <button 
              onClick={() => setTimeframe("today")}
              className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-colors", timeframe === "today" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80")}
            >
              Today's Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <StatCard 
              title={timeframe === "overall" ? "Net P/L" : "Today's P/L"} 
              value={`${timeframe === "overall" ? stats.netPnl > 0 ? '+' : '' : stats.todaysPnl > 0 ? '+' : ''}$${Math.abs(timeframe === "overall" ? stats.netPnl : stats.todaysPnl).toFixed(2)}`} 
              trend={(timeframe === "overall" ? stats.netPnl : stats.todaysPnl) >= 0 ? "up" : "down"}
              trendValue={timeframe === "overall" ? "All Time" : "Today"}
              icon={Target} 
            />
            <StatCard 
              title={timeframe === "overall" ? "Win Rate" : "Today's Win Rate"} 
              value={`${(timeframe === "overall" ? stats.winRate : (stats.todaysTrades > 0 ? (stats.todaysWins / stats.todaysTrades * 100) : 0)).toFixed(1)}%`} 
              trend={(timeframe === "overall" ? stats.winRate : (stats.todaysTrades > 0 ? (stats.todaysWins / stats.todaysTrades * 100) : 0)) >= 50 ? "up" : "down"}
              trendValue={`${timeframe === "overall" ? stats.totalTrades : stats.todaysTrades} Trades`}
              icon={Activity} 
            />
            <StatCard 
              title="Profit Factor" 
              value={stats.profitFactor.toFixed(2)} 
              trend={stats.profitFactor >= 1.5 ? "up" : "down"}
              trendValue={timeframe === "overall" ? "Target: >1.5" : "All Time Metric"}
              icon={ArrowUpRight} 
            />
            <StatCard 
              title="Avg Exec Score" 
              value={Math.round(stats.avgExec).toString()} 
              trend={stats.avgExec >= 80 ? "up" : "down"}
              trendValue={timeframe === "overall" ? "Out of 100" : "All Time Metric"}
              icon={Shield} 
            />

          {/* Wide Middle Section */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 md:p-6 h-[400px]">
              <ChartWidget title="Equity Curve" subtitle="Cumulative Balance Over Time">
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffb800" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ffb800" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val.toLocaleString()}`} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#ffb800', fontWeight: 'bold', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="equity" stroke="#ffb800" strokeWidth={2} fillOpacity={1} fill="url(#colorEquity)" />
                </AreaChart>
              </ChartWidget>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Current Streak</h3>
                  <div className={cn("text-xl font-black", stats.streakIsWin ? "text-emerald-500" : "text-rose-500")}>
                    {stats.streak}
                  </div>
                </div>
                {stats.streakIsWin ? <TrendingUp className="text-emerald-500/20 w-8 h-8" /> : <TrendingDown className="text-rose-500/20 w-8 h-8" />}
              </div>
              
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Rule Compliance</h3>
                  <div className="text-xl font-black text-white/90">98%</div>
                </div>
                <Shield className="text-white/10 w-8 h-8" />
              </div>
              
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Psychology Score</h3>
                  <div className="text-xl font-black text-brand-amber">Stable</div>
                </div>
                <Brain className="text-brand-amber/20 w-8 h-8" />
              </div>
            </div>

            {/* Recent Trades Section */}
            <div className="mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="text-brand-amber" size={18} />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white/90">Recent Trades</h2>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/[0.04]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Date / Pair</th>
                      <th className="px-4 py-3 font-medium text-center">Score</th>
                      <th className="px-4 py-3 font-medium text-right">P/L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {(stats.recentTrades || []).length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-white/30 italic">No recent trades found.</td>
                      </tr>
                    )}
                    {(stats.recentTrades || []).map((trade: any) => (
                      <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white/90">{trade.pair} <span className={cn("ml-2 px-1.5 py-0.5 rounded text-[9px]", trade.direction==="Long"?"bg-emerald-500/10 text-emerald-500":"bg-rose-500/10 text-rose-500")}>{trade.direction}</span></div>
                          <div className="text-[10px] text-white/40 font-mono mt-1">{trade.date}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-amber/10 text-brand-amber font-bold text-[10px] border border-brand-amber/20">
                            {trade.score_overall || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-sm">
                          <span className={trade.profit > 0 ? "text-emerald-500" : trade.profit < 0 ? "text-rose-500" : "text-white/50"}>
                            {trade.profit > 0 ? "+" : ""}{trade.profit || '0'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar Section */}
          <div className="lg:col-span-1 space-y-4">
            <PropFirmWidget />
            
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 relative">
              <h3 className="text-sm font-bold text-white mb-4">Today's Status</h3>
              
              <div className="space-y-2">
                <div className="bg-[#111] rounded-lg p-3 flex justify-between items-center border border-white/5">
                  <div className="flex items-center gap-2 text-white/50">
                    <Target size={14} />
                    <span className="text-xs uppercase tracking-widest font-semibold">Bias</span>
                  </div>
                  <span className={cn("text-xs font-bold uppercase", stats.todaysBias === 'BULLISH' ? 'text-emerald-500' : stats.todaysBias === 'BEARISH' ? 'text-rose-500' : 'text-white/50')}>{stats.todaysBias}</span>
                </div>
                
                <div className="bg-[#111] rounded-lg p-3 flex justify-between items-center border border-white/5">
                  <div className="flex items-center gap-2 text-white/50">
                    <Clock size={14} />
                    <span className="text-xs uppercase tracking-widest font-semibold">Session</span>
                  </div>
                  <span className="text-xs font-bold text-white/90 uppercase">{stats.todaysSession}</span>
                </div>
                
                <div className="bg-[#111] rounded-lg p-3 flex justify-between items-center border border-white/5">
                  <div className="flex items-center gap-2 text-white/50">
                    <Flame size={14} />
                    <span className="text-xs uppercase tracking-widest font-semibold">Mood</span>
                  </div>
                  <span className="text-xs font-bold text-white/90 uppercase">{stats.todaysMood}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5 text-white/50">
                    <Shield size={12} />
                    <span className="text-[10px] uppercase tracking-widest font-semibold">Risk Limit</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/80">{(stats.todaysRiskLimit || 0).toFixed(1)}% / 2.0%</span>
                </div>
                <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-amber h-full transition-all duration-1000" style={{ width: `${Math.min(((stats.todaysRiskLimit || 0) / 2) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>

            {/* Performance Analysis Section (Moved to Sidebar) */}
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg border border-brand-amber/20 bg-brand-amber/5 flex items-center justify-center text-brand-amber shrink-0">
                  <Brain size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white/90 flex items-center gap-2">Performance Analysis <Sparkles size={12} className="text-brand-amber"/></h2>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Overall Data</p>
                </div>
              </div>

              <div className="space-y-3">
                {stats.bestPair !== 'N/A' && stats.totalTrades >= 3 && (
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                    <div className="flex gap-2">
                      <TrendingUp size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xs font-bold text-white/90 mb-1">{stats.bestPair} Optimization</h3>
                        <p className="text-[10px] text-white/50 leading-relaxed">
                          You have a <span className="text-white/80 font-mono">{stats.bestPairWinRate}%</span> win rate trading <span className="text-white/80 font-semibold">{stats.bestPair}</span>. Consider focusing more on this pair.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {stats.worstPair !== 'N/A' && stats.worstPair !== stats.bestPair && stats.totalTrades >= 3 && (
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                    <div className="flex gap-2">
                      <AlertTriangle size={14} className="text-brand-amber shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xs font-bold text-white/90 mb-1">{stats.worstPair} Underperformance</h3>
                        <p className="text-[10px] text-white/50 leading-relaxed">
                          You are consistently losing on <span className="text-brand-amber">{stats.worstPair}</span>. Review these setups or reduce lot sizing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(stats.improvements || []).length > 0 && stats.totalTrades >= 3 ? (
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                    <div className="flex gap-2">
                      <Lightbulb size={14} className="text-brand-amber shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xs font-bold text-white/90 mb-1">Areas to Improve</h3>
                        {(stats.improvements || []).map((imp: string, i: number) => (
                          <p key={i} className="text-[10px] text-white/50 leading-relaxed mb-1">{imp}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-[10px] text-white/30 italic border border-white/5 rounded-xl bg-[#0a0a0a]">
                    More trade data required to generate Performance Insights.
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
