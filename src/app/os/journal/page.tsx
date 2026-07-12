"use client";

import React, { useState, useEffect } from "react";
import { Plus, ListFilter, CheckCircle, Upload, Image as ImageIcon, X, Sparkles, Target, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { insforge } from "@/lib/insforge";
import { useAccount } from "@/contexts/AccountContext";
import { aiService } from "@/lib/ai";

export default function JournalPage() {
  const { activeAccount } = useAccount();
  const [view, setView] = useState<"list" | "entry" | "gallery">("entry");
  const [trades, setTrades] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    plan_id: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().substring(0, 5),
    pair: "",
    direction: "Long",
    entry_price: "",
    exit_price: "",
    stop_loss: "",
    take_profit: "",
    lot_size: "",
    risk_amount: "",
    profit: "",
    result: "Win",
    setup: "",
    session: "New York",
    confidence: "8",
    stress: "3",
    went_well: "",
    image_url: ""
  });

  const [checklist, setChecklist] = useState({
    followedPlan: false,
    movedStopLoss: false,
    closedEarly: false,
    addedPosition: false,
    feltFomo: false,
    revengeTraded: false
  });

  useEffect(() => {
    fetchTrades();
    fetchPlans();
  }, [activeAccount]);

  const fetchTrades = async () => {
    if (!activeAccount) return;
    try {
      const { data, error } = await insforge.database
        .from("trades")
        .select(`*, trading_plans(*)`)
        .eq("account_id", activeAccount.id)
        .order("created_at", { ascending: false });
      if (error) console.error("fetchTrades Error:", error);
      if (!error && data) setTrades(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPlans = async () => {
    if (!activeAccount) return;
    try {
      const { data, error } = await insforge.database
        .from("trading_plans")
        .select("*")
        .eq("account_id", activeAccount.id)
        .order("created_at", { ascending: false });
      if (error) console.error("fetchPlans Error:", error);
      if (!error && data) setPlans(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Auto-fill from plan
    if (e.target.name === "plan_id" && e.target.value) {
      const plan = plans.find(p => p.id === e.target.value);
      if (plan) {
        setFormData(prev => ({
          ...prev,
          plan_id: plan.id,
          pair: plan.pair,
          direction: plan.direction,
          setup: plan.setup,
          session: plan.session || prev.session,
          entry_price: plan.entry_price?.toString() || "",
          stop_loss: plan.stop_loss?.toString() || "",
          take_profit: plan.take_profit?.toString() || "",
          risk_amount: plan.risk_amount?.toString() || ""
        }));
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image_url: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const calculateScores = (payload: any) => {
    // Mock logic for execution score
    let execScore = 80;
    if (checklist.followedPlan) execScore += 10;
    if (checklist.movedStopLoss) execScore -= 15;
    if (checklist.closedEarly) execScore -= 10;
    
    let emotionalScore = 100 - (payload.stress * 5) + (payload.confidence * 2);
    emotionalScore = Math.min(100, Math.max(0, emotionalScore));
    
    return {
      score_execution: Math.min(100, Math.max(0, execScore)),
      score_emotional_control: emotionalScore,
      score_overall: Math.floor((execScore + emotionalScore) / 2)
    };
  };

  const handleSaveTrade = async () => {
    if (!activeAccount) return;
    setLoading(true);
    try {
      const payload: any = {
        account_id: activeAccount.id,
        plan_id: formData.plan_id || null,
        date: formData.date,
        time: formData.time || "12:00:00", // Ensure time is never empty
        pair: formData.pair.toUpperCase() || "UNKNOWN",
        direction: formData.direction,
        entry_price: formData.entry_price ? parseFloat(formData.entry_price) : null,
        exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
        stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : null,
        take_profit: formData.take_profit ? parseFloat(formData.take_profit) : null,
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
        risk: formData.risk_amount ? parseFloat(formData.risk_amount) : 0,
        profit: formData.profit ? parseFloat(formData.profit) : 0,
        result: formData.result,
        setup: formData.setup,
        session: formData.session,
        mood: formData.stress > "5" ? "Stressed" : "Calm",
        tags: [],
        went_well: formData.went_well,
        screenshot_url: formData.image_url
      };

      if (checklist.feltFomo) payload.tags.push("FOMO");
      if (checklist.revengeTraded) payload.tags.push("Revenge");

      // AI Generation
      const aiSummary = await aiService.generateTradeSummary(payload as any, plans.find(p=>p.id === payload.plan_id));
      const mistakes = await aiService.extractMistakes(payload as any);
      
      const scores = calculateScores({...payload, confidence: parseInt(formData.confidence), stress: parseInt(formData.stress)});
      
      const fullPayload = {
        ...payload,
        ...scores,
        ai_summary: aiSummary,
        mistakes: mistakes
      };

      const { error: insertError } = await insforge.database.from("trades").insert([fullPayload]);
      if (insertError) throw insertError;
      
      alert("Trade logged and AI analyzed successfully!");
      fetchTrades();
      setView("list");
    } catch (error: any) {
      console.error(error);
      alert("Failed to save: " + (error.message || "Make sure db schema is applied."));
    }
    setLoading(false);
  };

  const handleDeleteTrade = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this trade?")) return;
    try {
      await insforge.database.from("trades").delete().eq("id", id);
      setTrades(trades.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete trade", error);
      alert("Failed to delete trade.");
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Smart Trading Journal</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">AI-Powered Trade Analysis</p>
        </div>
        <div className="flex gap-1 bg-[#0a0a0a] p-1 rounded border border-white/[0.04]">
          <button onClick={() => setView("list")} className={cn("px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5", view === "list" ? "bg-white/5 text-brand-amber border border-white/[0.04]" : "text-white/40 hover:text-white/90")}>
            <ListFilter size={14} /> Trades
          </button>
          <button onClick={() => setView("gallery")} className={cn("px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5", view === "gallery" ? "bg-white/5 text-brand-amber border border-white/[0.04]" : "text-white/40 hover:text-white/90")}>
            <ImageIcon size={14} /> Gallery
          </button>
          <button onClick={() => setView("entry")} className={cn("px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5", view === "entry" ? "bg-white/5 text-brand-amber border border-white/[0.04]" : "text-white/40 hover:text-white/90")}>
            <Plus size={14} /> Log Entry
          </button>
        </div>
      </div>

      {view === "entry" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 space-y-4">
            
            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <div className="flex flex-col mb-4 pb-2 border-b border-white/[0.04]">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Link to Pre-Trade Plan</h3>
                  <Target size={14} className="text-brand-amber opacity-50" />
                </div>
                <p className="text-[10px] text-white/40">Select a saved plan to auto-fill your trade details and score your discipline.</p>
              </div>
              <select name="plan_id" value={formData.plan_id} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-3 py-2 text-sm text-white/90 focus:outline-none focus:border-brand-amber/50">
                <option value="">-- No plan / Spontaneous Trade --</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.pair} {p.direction} - {p.setup} ({new Date(p.created_at).toLocaleDateString()})</option>
                ))}
              </select>
            </div>

            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Trade Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Pair</label>
                  <input type="text" name="pair" value={formData.pair} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono uppercase" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Direction</label>
                  <select name="direction" value={formData.direction} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50">
                    <option value="Long">Long</option>
                    <option value="Short">Short</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Setup</label>
                  <input type="text" name="setup" value={formData.setup} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Session</label>
                  <select name="session" value={formData.session} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50">
                    <option value="Asia">Asia</option>
                    <option value="London">London</option>
                    <option value="New York">New York</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Execution</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Entry Price</label>
                  <input type="number" name="entry_price" value={formData.entry_price} onChange={handleChange} step="any" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Stop Loss</label>
                  <input type="number" name="stop_loss" value={formData.stop_loss} onChange={handleChange} step="any" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Take Profit</label>
                  <input type="number" name="take_profit" value={formData.take_profit} onChange={handleChange} step="any" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Exit Price</label>
                  <input type="number" name="exit_price" value={formData.exit_price} onChange={handleChange} step="any" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Lot Size</label>
                  <input type="number" name="lot_size" value={formData.lot_size} onChange={handleChange} step="any" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Risk ($)</label>
                  <input type="number" name="risk_amount" value={formData.risk_amount} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04] space-y-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.04] pb-2">Psychology Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  {Object.entries(checklist).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="w-3.5 h-3.5 rounded-sm border border-white/[0.1] group-hover:border-brand-amber/50 flex items-center justify-center transition-colors bg-[#111]">
                        <input type="checkbox" checked={val} onChange={(e) => setChecklist({...checklist, [key]: e.target.checked})} className="hidden peer" />
                        <CheckCircle size={10} className="text-brand-amber opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[11px] text-white/60 group-hover:text-white/90 tracking-wide capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Confidence</label>
                      <span className="text-[10px] font-mono text-white/60">{formData.confidence}/10</span>
                    </div>
                    <input type="range" name="confidence" value={formData.confidence} onChange={handleChange} min="1" max="10" className="w-full accent-brand-amber h-1 bg-[#111] rounded appearance-none" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Stress / Anxiety</label>
                      <span className="text-[10px] font-mono text-white/60">{formData.stress}/10</span>
                    </div>
                    <input type="range" name="stress" value={formData.stress} onChange={handleChange} min="1" max="10" className="w-full accent-brand-orange h-1 bg-[#111] rounded appearance-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            
            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Result & Notes</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {["Win", "Loss", "Break Even"].map((res) => (
                  <button key={res} onClick={() => setFormData({ ...formData, result: res })} className={cn("py-1.5 rounded border text-[11px] font-bold uppercase tracking-wider transition-colors", formData.result === res ? "bg-white/20 border-white/40 text-white" : "bg-white/[0.02] border-white/5 text-white/40")}>
                    {res}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5 mb-4">
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Net P/L ($)</label>
                <input type="number" name="profit" value={formData.profit} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-3 py-2 font-mono font-bold text-lg focus:outline-none focus:border-brand-amber/50" placeholder="$0.00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Manual Notes</label>
                <textarea name="went_well" value={formData.went_well} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 min-h-[80px]" placeholder="Optional notes... AI will generate the rest." />
              </div>
            </div>

            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Screenshot</h3>
              {formData.image_url ? (
                <div className="relative rounded overflow-hidden group border border-white/10">
                  <img src={formData.image_url} alt="Trade" className="w-full" />
                  <button onClick={() => setFormData({ ...formData, image_url: "" })} className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full hover:bg-rose-500/80"><X size={14}/></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-white/20 rounded cursor-pointer hover:border-brand-amber/50">
                  <Upload className="w-5 h-5 mb-1 text-white/40" />
                  <span className="text-[10px] text-white/50">Upload Screenshot</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            
            <button onClick={handleSaveTrade} disabled={loading} className="w-full py-3 rounded bg-brand-amber text-black font-bold text-sm uppercase tracking-wider hover:bg-brand-amber/90 transition-all flex justify-center items-center gap-2">
              <Sparkles size={16} />
              {loading ? "Analyzing..." : "Save & Analyze"}
            </button>
          </div>
        </div>
      )}

      {/* List and Details View */}
      {view === "list" && (
        <div className="bg-[#0a0a0a] rounded-lg border border-white/[0.04] overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/[0.04]">
              <tr>
                <th className="px-4 py-3 font-medium">Date / Pair</th>
                <th className="px-4 py-3 font-medium text-center">Score</th>
                <th className="px-4 py-3 font-medium text-right">P/L</th>
                <th className="px-4 py-3 font-medium text-right w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {trades.map((trade) => (
                <tr key={trade.id} onClick={() => setSelectedTrade(trade)} className="hover:bg-white/[0.04] cursor-pointer">
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
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={(e) => handleDeleteTrade(e, trade.id)} 
                      className="p-1.5 rounded-md text-white/20 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Trade"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gallery View */}
      {view === "gallery" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trades.filter(t => t.screenshot_url).length === 0 ? (
            <div className="col-span-full p-8 text-center text-white/40 bg-[#0a0a0a] rounded-lg border border-white/[0.04]">
              No screenshots found. Upload images when logging trades to see them here!
            </div>
          ) : (
            trades.filter(t => t.screenshot_url).map(trade => (
              <div key={trade.id} onClick={() => setSelectedTrade(trade)} className="bg-[#0a0a0a] rounded-lg border border-white/[0.04] overflow-hidden cursor-pointer group hover:border-brand-amber/50 transition-colors">
                <div className="aspect-video relative overflow-hidden bg-[#111]">
                  <img src={trade.screenshot_url} alt="Trade Screenshot" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white/90">{trade.pair}</h3>
                    <p className="text-[10px] text-white/40 font-mono">{trade.date}</p>
                  </div>
                  <div className={cn("font-bold font-mono text-sm", trade.profit > 0 ? "text-emerald-500" : "text-rose-500")}>
                    {trade.profit > 0 ? "+" : ""}${Math.abs(trade.profit)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTrade(null)}>
          <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white/90">{selectedTrade.pair}</h2>
                  <div className="text-xs text-white/40 font-mono mt-1">{selectedTrade.date} | {selectedTrade.direction}</div>
                </div>
                <div className="text-right">
                  <div className={cn("text-2xl font-bold font-mono", selectedTrade.profit > 0 ? "text-emerald-500" : selectedTrade.profit < 0 ? "text-rose-500" : "text-white/50")}>
                    {selectedTrade.profit > 0 ? "+" : ""}${Math.abs(selectedTrade.profit || 0)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#111] p-4 rounded-lg text-center border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Execution Score</div>
                  <div className="text-xl font-bold text-brand-amber">{selectedTrade.score_overall || '-'}</div>
                </div>
                <div className="bg-[#111] p-4 rounded-lg text-center border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Risk Amount</div>
                  <div className="text-xl font-bold text-white/90">${selectedTrade.risk || '0'}</div>
                </div>
                <div className="bg-[#111] p-4 rounded-lg text-center border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Plan Link</div>
                  <div className="text-sm font-bold text-white/90 mt-1">{selectedTrade.trading_plans ? "Yes" : "No Plan"}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-brand-amber/5 border border-brand-amber/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-brand-amber">
                    <Sparkles size={14} />
                    <h3 className="text-xs font-bold uppercase tracking-widest">AI Trade Summary</h3>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{selectedTrade.ai_summary || 'No AI summary generated for this trade.'}</p>
                </div>

                {selectedTrade.mistakes && (Array.isArray(selectedTrade.mistakes) ? selectedTrade.mistakes.length > 0 : true) && (
                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                    <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">Detected Mistakes</h3>
                    <ul className="list-disc list-inside text-sm text-rose-400/80">
                      {(Array.isArray(selectedTrade.mistakes) ? selectedTrade.mistakes : [selectedTrade.mistakes]).map((m: any, i: number) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                )}
                
                {selectedTrade.screenshot_url && (
                  <img src={selectedTrade.screenshot_url} alt="Trade" className="w-full rounded border border-white/10" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
