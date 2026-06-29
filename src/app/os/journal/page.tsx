"use client";

import React, { useState, useEffect } from "react";
import { Plus, ListFilter, CheckCircle, Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { insforge } from "@/lib/insforge";
import { useAccount } from "@/contexts/AccountContext";
import { generateTradeAdvice } from "@/lib/tradeAnalyzer";

export default function JournalPage() {
  const { activeAccount } = useAccount();
  const [view, setView] = useState<"list" | "entry" | "gallery">("entry");
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "",
    pair: "",
    direction: "Long",
    entry_price: "",
    exit_price: "",
    stop_loss: "",
    take_profit: "",
    lot_size: "",
    risk_amount: "",
    profit: "",
    result: "",
    setup: "",
    confidence: "8",
    stress: "3",
    went_well: "",
    mistakes: "",
    improvement_notes: "",
    image_url: ""
  });

  // Psychology checklist state
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
  }, [activeAccount]);

  const fetchTrades = async () => {
    if (!activeAccount) {
      setTrades([]);
      return;
    }
    try {
      const { data, error } = await insforge.database
        .from("trades")
        .select("*")
        .eq("account_id", activeAccount.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTrade = async () => {
    if (!activeAccount) {
      alert("Please select or create an account first.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        account_id: activeAccount.id,
        date: formData.date,
        time: formData.time,
        pair: formData.pair.toUpperCase(),
        direction: formData.direction,
        entry_price: formData.entry_price ? parseFloat(formData.entry_price) : null,
        exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
        stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : null,
        take_profit: formData.take_profit ? parseFloat(formData.take_profit) : null,
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
        risk_amount: formData.risk_amount ? parseFloat(formData.risk_amount) : null,
        profit: formData.profit ? parseFloat(formData.profit) : null,
        result: formData.result,
        setup: formData.setup,
        confidence: parseInt(formData.confidence),
        stress: parseInt(formData.stress),
        went_well: formData.went_well,
        mistakes: formData.mistakes,
        improvement_notes: formData.improvement_notes,
        image_url: formData.image_url
      };

      const { data, error } = await insforge.database.from("trades").insert([payload]).select();

      if (error) {
        console.error("Insert Error:", error);
        alert("Failed to save trade. If RLS is enabled, you may need to disable it or implement authentication first.");
      } else {
        alert("Trade saved successfully!");
        setFormData({
          ...formData, pair: "", entry_price: "", exit_price: "", stop_loss: "", take_profit: "", lot_size: "", risk_amount: "", profit: "", result: "", setup: "", went_well: "", mistakes: "", improvement_notes: "", image_url: ""
        });
        fetchTrades();
        setView("list");
      }
    } catch (error) {
      console.error("Error saving trade:", error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Trading Journal</h1>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">Trade Log & Analysis</p>
        </div>
        <div className="flex gap-1 bg-[#0a0a0a] p-1 rounded border border-white/[0.04]">
          <button 
            onClick={() => setView("list")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5",
              view === "list" ? "bg-white/5 text-brand-amber border border-white/[0.04]" : "text-white/40 hover:text-white/90"
            )}
          >
            <ListFilter size={14} /> Trades
          </button>
          <button 
            onClick={() => setView("gallery")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5",
              view === "gallery" ? "bg-white/5 text-brand-amber border border-white/[0.04]" : "text-white/40 hover:text-white/90"
            )}
          >
            <ImageIcon size={14} /> Gallery
          </button>
          <button 
            onClick={() => setView("entry")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5",
              view === "entry" ? "bg-white/5 text-brand-amber border border-white/[0.04]" : "text-white/40 hover:text-white/90"
            )}
          >
            <Plus size={14} /> Log Entry
          </button>
        </div>
      </div>

      {view === "entry" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 space-y-4">
            
            {/* Trade Details */}
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
                  <input type="text" name="pair" value={formData.pair} onChange={handleChange} placeholder="EUR/USD" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono placeholder:text-white/20 uppercase" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Direction</label>
                  <select name="direction" value={formData.direction} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 appearance-none">
                    <option value="Long">Long</option>
                    <option value="Short">Short</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Execution */}
            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Execution</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Entry Price</label>
                  <input type="number" name="entry_price" value={formData.entry_price} onChange={handleChange} step="0.00001" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Stop Loss</label>
                  <input type="number" name="stop_loss" value={formData.stop_loss} onChange={handleChange} step="0.00001" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Take Profit</label>
                  <input type="number" name="take_profit" value={formData.take_profit} onChange={handleChange} step="0.00001" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Exit Price</label>
                  <input type="number" name="exit_price" value={formData.exit_price} onChange={handleChange} step="0.00001" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Lot Size</label>
                  <input type="number" name="lot_size" value={formData.lot_size} onChange={handleChange} step="0.01" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Risk Amount ($)</label>
                  <input type="number" name="risk_amount" value={formData.risk_amount} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" />
                </div>
              </div>
            </div>

            {/* Psychology & Review */}
            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04] space-y-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.04] pb-2">Psychology & Review</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider">During Trade</h4>
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
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Emotions</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Confidence</label>
                      <span className="text-[10px] font-mono text-white/60">{formData.confidence}/10</span>
                    </div>
                    <input type="range" name="confidence" value={formData.confidence} onChange={handleChange} min="1" max="10" className="w-full accent-brand-amber h-1 bg-[#111] rounded appearance-none" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Stress</label>
                      <span className="text-[10px] font-mono text-white/60">{formData.stress}/10</span>
                    </div>
                    <input type="range" name="stress" value={formData.stress} onChange={handleChange} min="1" max="10" className="w-full accent-brand-orange h-1 bg-[#111] rounded appearance-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">What went well?</label>
                  <textarea name="went_well" value={formData.went_well} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 min-h-[60px] resize-y" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Mistakes & Lessons</label>
                  <textarea name="mistakes" value={formData.mistakes} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 min-h-[60px] resize-y" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">What to Improve</label>
                  <textarea name="improvement_notes" value={formData.improvement_notes} onChange={handleChange} placeholder="Based on analysis, what should you improve next time?" className="w-full bg-[#111] border border-white/[0.06] rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-brand-amber/50 min-h-[60px] resize-y" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar for Entry */}
          <div className="space-y-4">
            
            {/* Image Upload */}
            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Trade Image</h3>
              {formData.image_url ? (
                <div className="relative rounded border border-white/[0.06] overflow-hidden group">
                  <img src={formData.image_url} alt="Trade setup" className="w-full h-auto object-cover max-h-[200px]" />
                  <button 
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                    className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/80"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/[0.06] rounded cursor-pointer hover:border-brand-amber/50 hover:bg-white/[0.02] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 mb-2 text-white/40" />
                    <p className="text-xs text-white/60 font-medium">Click to upload image</p>
                    <p className="text-[10px] text-white/40 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <div className="bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.04]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 pb-2 border-b border-white/[0.04]">Trade Result</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["Win", "Loss", "Break Even", "Partial"].map((res) => (
                  <button 
                    key={res}
                    onClick={() => setFormData({ ...formData, result: res })}
                    className={cn(
                      "py-1.5 rounded border text-[11px] font-bold uppercase tracking-wider transition-colors",
                      formData.result === res 
                        ? (res === "Win" ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" : res === "Loss" ? "bg-rose-500/20 border-rose-500 text-rose-500" : "bg-white/10 border-white/30 text-white") 
                        : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5"
                    )}
                  >
                    {res}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Net P/L ($)</label>
                <input type="number" name="profit" value={formData.profit} onChange={handleChange} className="w-full bg-[#111] border border-white/[0.06] rounded px-3 py-2 font-mono font-bold text-lg focus:outline-none focus:border-brand-amber/50" placeholder="$0.00" />
              </div>
            </div>
            
            <button 
              onClick={handleSaveTrade} 
              disabled={loading}
              className="w-full py-2.5 rounded bg-brand-amber text-[#0a0a0a] font-bold text-sm uppercase tracking-wider hover:bg-brand-amber/90 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Trade"}
            </button>
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="bg-[#0a0a0a] rounded-lg border border-white/[0.04]">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
            <h3 className="text-sm font-semibold text-white/90 tracking-wide">Trade History</h3>
          </div>
          <div className="overflow-x-auto">
            {trades.length === 0 ? (
              <div className="p-8 text-center text-white/40 text-xs">
                <p>No trades logged yet. Start by logging an entry!</p>
              </div>
            ) : (
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
                  {trades.map((trade) => (
                    <tr key={trade.id} onClick={() => setSelectedTrade(trade)} className="hover:bg-white/[0.04] transition-colors group cursor-pointer">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-white/90 uppercase">{trade.pair}</div>
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
            )}
          </div>
        </div>
      )}

      {view === "gallery" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trades.filter(t => t.image_url).length === 0 ? (
              <div className="col-span-full p-8 text-center bg-[#0a0a0a] rounded-lg border border-white/[0.04] text-white/40 text-xs">
                <p>No trade images uploaded yet.</p>
              </div>
            ) : (
              trades.filter(t => t.image_url).map((trade) => (
                <div key={trade.id} onClick={() => setSelectedTrade(trade)} className="bg-[#0a0a0a] rounded-lg border border-white/[0.04] overflow-hidden group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden bg-[#111]">
                    <img src={trade.image_url} alt={`${trade.pair} setup`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest backdrop-blur-md",
                        trade.direction === "Long" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/20 text-rose-400 border border-rose-500/20"
                      )}>
                        {trade.direction}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white/90 uppercase">{trade.pair}</h4>
                        <p className="text-[10px] text-white/40 font-mono">{trade.date} {trade.time}</p>
                      </div>
                      <div className={cn(
                        "font-mono font-bold text-sm",
                        trade.profit > 0 ? "text-emerald-500" :
                        trade.profit < 0 ? "text-rose-500" : "text-white/50"
                      )}>
                        {trade.profit > 0 ? "+" : ""}{trade.profit ? `$${Math.abs(trade.profit)}` : 'BE'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Trade Details Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedTrade(null)}>
          <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedTrade(null)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 transition-colors z-10"
            >
              <X size={16} />
            </button>
            
            {selectedTrade.image_url && (
              <div className="w-full bg-[#111] relative border-b border-white/[0.06]">
                <img src={selectedTrade.image_url} alt="Trade Setup" className="w-full h-auto max-h-[400px] object-contain" />
              </div>
            )}
            
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-white/90 uppercase tracking-tight">{selectedTrade.pair}</h2>
                  <div className="flex gap-3 items-center mt-2 text-xs text-white/40 font-mono">
                    <span>{selectedTrade.date}</span>
                    <span>{selectedTrade.time}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded font-bold uppercase tracking-widest text-[10px]",
                      selectedTrade.direction === "Long" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>{selectedTrade.direction}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Result</div>
                  <div className={cn(
                    "text-xl font-bold font-mono",
                    selectedTrade.profit > 0 ? "text-emerald-500" :
                    selectedTrade.profit < 0 ? "text-rose-500" : "text-white/50"
                  )}>
                    {selectedTrade.profit > 0 ? "+" : ""}{selectedTrade.profit ? `$${Math.abs(selectedTrade.profit)}` : 'BE'}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Entry</div>
                  <div className="font-mono text-sm text-white/90 mt-1">{selectedTrade.entry_price || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Exit</div>
                  <div className="font-mono text-sm text-white/90 mt-1">{selectedTrade.exit_price || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Stop Loss</div>
                  <div className="font-mono text-sm text-white/90 mt-1">{selectedTrade.stop_loss || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Take Profit</div>
                  <div className="font-mono text-sm text-white/90 mt-1">{selectedTrade.take_profit || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Lot Size</div>
                  <div className="font-mono text-sm text-white/90 mt-1">{selectedTrade.lot_size || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Risk</div>
                  <div className="font-mono text-sm text-white/90 mt-1">{selectedTrade.risk_amount ? `$${selectedTrade.risk_amount}` : '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Confidence</div>
                  <div className="font-mono text-sm text-white/90 mt-1">{selectedTrade.confidence}/10</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Stress</div>
                  <div className="font-mono text-sm text-white/90 mt-1">{selectedTrade.stress}/10</div>
                </div>
              </div>

              {/* Notes */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedTrade.went_well && (
                  <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2">What went well</h4>
                    <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">{selectedTrade.went_well}</p>
                  </div>
                )}
                {selectedTrade.mistakes && (
                  <div className="p-4 bg-rose-500/5 rounded-lg border border-rose-500/10">
                    <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">Mistakes & Lessons</h4>
                    <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">{selectedTrade.mistakes}</p>
                  </div>
                )}
                {(selectedTrade.improvement_notes || generateTradeAdvice(selectedTrade)) && (
                  <div className="p-4 bg-brand-amber/5 rounded-lg border border-brand-amber/10">
                    <h4 className="text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-2">What to Improve (Analysis)</h4>
                    <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">{selectedTrade.improvement_notes || generateTradeAdvice(selectedTrade)}</p>
                  </div>
                )}
                {!selectedTrade.went_well && !selectedTrade.mistakes && !selectedTrade.improvement_notes && (
                  <div className="sm:col-span-2 lg:col-span-3 text-center p-4 bg-white/[0.02] rounded-lg border border-white/[0.04] text-white/40 text-xs">
                    No notes recorded for this trade.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
