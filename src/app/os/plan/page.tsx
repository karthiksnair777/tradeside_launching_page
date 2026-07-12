"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "@/contexts/AccountContext";
import { insforge } from "@/lib/insforge";
import { Target, CheckCircle2, AlertCircle, Upload, X } from "lucide-react";

export default function TradingPlanPage() {
  const { activeAccount } = useAccount();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    pair: "XAU/USD",
    direction: "Long",
    setup: "",
    timeframe: "1H",
    entry_price: "",
    stop_loss: "",
    take_profit: "",
    risk_amount: "",
    session: "New York",
    bias: "Bullish",
    screenshot_url: ""
  });

  const [checklist, setChecklist] = useState({
    trend: false,
    levels: false,
    news: false,
    rr: false,
    mental: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, screenshot_url: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount) {
      setError("No active account selected.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: dbError } = await insforge.database
        .from("trading_plans")
        .insert([{
          account_id: activeAccount.id,
          pair: formData.pair,
          direction: formData.direction,
          setup: formData.setup,
          timeframe: formData.timeframe,
          entry_price: formData.entry_price ? parseFloat(formData.entry_price) : null,
          stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : null,
          take_profit: formData.take_profit ? parseFloat(formData.take_profit) : null,
          risk_amount: formData.risk_amount ? parseFloat(formData.risk_amount) : null,
          session: formData.session,
          bias: formData.bias,
          checklist_completed: Object.values(checklist).every(Boolean),
          screenshot_url: formData.screenshot_url
        }]);

      if (dbError) throw dbError;
      
      setSuccess(true);
      // Reset form
      setFormData({
        pair: "XAU/USD",
        direction: "Long",
        setup: "",
        timeframe: "1H",
        entry_price: "",
        stop_loss: "",
        take_profit: "",
        risk_amount: "",
        session: "New York",
        bias: "Bullish",
        screenshot_url: ""
      });
      setChecklist({ trend: false, levels: false, news: false, rr: false, mental: false });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save trading plan. Ensure database tables are created.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Trading Plan Builder</h1>
            <p className="text-gray-400">Define your trade criteria before execution to maintain discipline.</p>
          </div>
          <Target className="w-10 h-10 text-brand-amber opacity-50" />
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Pair / Asset</label>
                <input required type="text" name="pair" value={formData.pair} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Direction</label>
                <select name="direction" value={formData.direction} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors">
                  <option value="Long">Long</option>
                  <option value="Short">Short</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Setup / Strategy</label>
                <input required type="text" name="setup" placeholder="e.g. Liquidity Sweep" value={formData.setup} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Timeframe</label>
                <select name="timeframe" value={formData.timeframe} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors">
                  <option value="1M">1M</option>
                  <option value="5M">5M</option>
                  <option value="15M">15M</option>
                  <option value="1H">1H</option>
                  <option value="4H">4H</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Planned Entry Price</label>
                <input type="number" step="any" name="entry_price" value={formData.entry_price} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Stop Loss</label>
                <input type="number" step="any" name="stop_loss" value={formData.stop_loss} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Take Profit</label>
                <input type="number" step="any" name="take_profit" value={formData.take_profit} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Risk Amount ($)</label>
                <input type="number" step="any" name="risk_amount" value={formData.risk_amount} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Session</label>
                <select name="session" value={formData.session} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors">
                  <option value="Asia">Asia</option>
                  <option value="London">London</option>
                  <option value="New York">New York</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Daily Bias</label>
                <select name="bias" value={formData.bias} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none transition-colors">
                  <option value="Bullish">Bullish</option>
                  <option value="Bearish">Bearish</option>
                  <option value="Neutral">Neutral</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-sm font-semibold text-white/80 mb-2">Pre-Trade Checklist</h3>
              
              {[
                { key: 'trend', label: 'Trend alignment verified on higher timeframe' },
                { key: 'levels', label: 'Key Support / Resistance zones marked' },
                { key: 'news', label: 'Economic calendar checked (No high-impact news)' },
                { key: 'rr', label: 'Risk-to-Reward ratio is strictly acceptable' },
                { key: 'mental', label: 'Mental state is calm, objective, and focused' }
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 rounded-sm border border-white/20 group-hover:border-brand-amber/50 flex items-center justify-center transition-colors bg-[#111]">
                    <input 
                      type="checkbox" 
                      checked={checklist[item.key as keyof typeof checklist]} 
                      onChange={(e) => setChecklist({...checklist, [item.key]: e.target.checked})} 
                      className="hidden peer" 
                    />
                    <CheckCircle2 size={12} className="text-brand-amber opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Chart / Setup Screenshot</h3>
              {formData.screenshot_url ? (
                <div className="relative rounded overflow-hidden group border border-white/10 max-w-sm">
                  <img src={formData.screenshot_url} alt="Trade Setup" className="w-full" />
                  <button onClick={() => setFormData({ ...formData, screenshot_url: "" })} className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full hover:bg-rose-500/80 transition-colors">
                    <X size={14} className="text-white"/>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-white/20 rounded-lg cursor-pointer hover:border-brand-amber/50 hover:bg-white/[0.02] transition-colors">
                  <Upload className="w-6 h-6 mb-2 text-white/40" />
                  <span className="text-xs text-white/50">Click or drag to upload screenshot</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm">Trading plan saved successfully. Stick to your plan!</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-amber hover:bg-[#e6a600] text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving Plan..." : "Lock in Trading Plan"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
