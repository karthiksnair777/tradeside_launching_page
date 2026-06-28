"use client";

import React, { useEffect, useState } from "react";
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
import { insforge } from "@/lib/insforge";
import { useAccount } from "@/contexts/AccountContext";

export default function AnalyticsPage() {
  const { activeAccount } = useAccount();
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [winRateData, setWinRateData] = useState<any[]>([]);
  const [totalWinRate, setTotalWinRate] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (!activeAccount) {
        setSessionData([]);
        setWinRateData([]);
        setTotalWinRate(0);
        return;
      }
      
      const { data, error } = await insforge.database
        .from("trades")
        .select("*")
        .eq("account_id", activeAccount.id);
      
      if (!error && data) {
        let wins = 0;
        let losses = 0;
        let be = 0;

        const sessions = {
          "Asian": { wins: 0, total: 0, pnl: 0 },
          "London": { wins: 0, total: 0, pnl: 0 },
          "New York": { wins: 0, total: 0, pnl: 0 }
        };

        data.forEach(t => {
          const pnl = Number(t.profit || 0);
          if (pnl > 0) wins++;
          else if (pnl < 0) losses++;
          else be++;

          // Basic Session estimation by hour (Assuming time is in UTC for this demo)
          if (t.time) {
            const hour = parseInt(t.time.split(':')[0], 10);
            let sess = "Asian";
            if (hour >= 7 && hour <= 12) sess = "London";
            else if (hour > 12 && hour <= 20) sess = "New York";

            sessions[sess as keyof typeof sessions].total++;
            sessions[sess as keyof typeof sessions].pnl += pnl;
            if (pnl > 0) sessions[sess as keyof typeof sessions].wins++;
          }
        });

        const total = data.length || 1;
        setTotalWinRate(Math.round((wins / total) * 100));
        
        setWinRateData([
          { name: "Wins", value: wins, color: "#10b981" },
          { name: "Losses", value: losses, color: "#f43f5e" },
          { name: "Break Even", value: be, color: "#64748b" },
        ]);

        const sessChartData = Object.entries(sessions).map(([name, stats]) => ({
          session: name,
          winRate: stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0,
          profit: stats.pnl
        }));
        setSessionData(sessChartData);
      }
    }
    loadData();
  }, [activeAccount]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Analytics</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Advanced Metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        
        {/* Session Performance */}
        <ChartWidget title="Session Performance" subtitle="Win rate & profitability" height={260}>
          <BarChart data={sessionData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
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
              data={winRateData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {winRateData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}
              itemStyle={{ color: '#fff' }}
            />
            <text x="50%" y="45%" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" fontFamily="monospace">
              {totalWinRate}%
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
