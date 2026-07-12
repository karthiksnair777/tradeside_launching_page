"use client";

import React, { useState } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { insforge } from "@/lib/insforge";
import { X, Plus, Shield, Flag, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountManagerProps {
  onClose: () => void;
}

export function AccountManager({ onClose }: AccountManagerProps) {
  const { accounts, activeAccount, setActiveAccount, refreshAccounts } = useAccount();
  const [view, setView] = useState<"list" | "create">("list");
  
  // Create Account State
  const [accountType, setAccountType] = useState<"LIVE" | "PROP_FIRM">("LIVE");
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  
  // Prop Firm specific fields
  const [profitTarget, setProfitTarget] = useState("");
  const [maxDailyDrawdown, setMaxDailyDrawdown] = useState("");
  const [maxTotalDrawdown, setMaxTotalDrawdown] = useState("");

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Trading Account
      const newAccountPayload = {
        name,
        initial_balance: parseFloat(balance),
        currency: "USD"
      };
      
      const { data: accData, error: accError } = await insforge.database
        .from("trading_accounts")
        .insert([newAccountPayload])
        .select("*");

      if (accError) throw accError;
      
      let createdAccount = null;
      if (accData && accData.length > 0) {
        createdAccount = accData[0];
      } else {
        // Fallback fetch if .select() fails in mock DB
        const { data: allAccs } = await insforge.database.from("trading_accounts").select("*").order("created_at", { ascending: false });
        if (allAccs && allAccs.length > 0) createdAccount = allAccs[0];
      }

      if (!createdAccount) throw new Error("Failed to retrieve created account ID");

      // 2. If Prop Firm, create the challenge record linked to the new account
      if (accountType === "PROP_FIRM") {
        const challengePayload = {
          account_id: createdAccount.id,
          firm_name: name,
          starting_balance: parseFloat(balance),
          profit_target: parseFloat(profitTarget),
          max_daily_drawdown: parseFloat(maxDailyDrawdown),
          max_total_drawdown: parseFloat(maxTotalDrawdown),
          minimum_days: 0,
          status: 'ACTIVE'
        };
        await insforge.database.from("prop_firm_challenges").insert([challengePayload]);
      }

      await refreshAccounts();
      setActiveAccount(createdAccount);
      setView("list");
    } catch (err) {
      console.error(err);
      alert("Failed to create account. Check console.");
    }
    setLoading(false);
  };

  const handleSelectAccount = (acc: any) => {
    setActiveAccount(acc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#111]">
          <h2 className="text-lg font-bold text-white/90">
            {view === "list" ? "Account Manager" : "Create New Account"}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {view === "list" && (
            <div className="space-y-4">
              {accounts.map(acc => (
                <div 
                  key={acc.id} 
                  onClick={() => handleSelectAccount(acc)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group",
                    activeAccount?.id === acc.id 
                      ? "bg-brand-amber/10 border-brand-amber/30 shadow-[0_0_15px_rgba(255,184,0,0.1)]" 
                      : "bg-[#111] border-white/5 hover:border-white/20"
                  )}
                >
                  <div>
                    <h3 className={cn("font-bold text-sm", activeAccount?.id === acc.id ? "text-brand-amber" : "text-white/90")}>{acc.name}</h3>
                    <p className="text-xs text-white/40 font-mono mt-1">Starting Bal: ${acc.initial_balance.toLocaleString()}</p>
                  </div>
                  {activeAccount?.id === acc.id && (
                    <CheckCircle2 size={18} className="text-brand-amber" />
                  )}
                </div>
              ))}

              <button 
                onClick={() => setView("create")}
                className="w-full mt-4 py-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/40 hover:bg-white/[0.02] transition-colors flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest"
              >
                <Plus size={16} /> New Account
              </button>
            </div>
          )}

          {view === "create" && (
            <form onSubmit={handleCreateAccount} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setAccountType("LIVE")}
                  className={cn("p-4 rounded-xl border flex flex-col items-center gap-2 transition-all", accountType === "LIVE" ? "bg-white/10 border-white/30" : "bg-black border-white/5 text-white/40")}
                >
                  <Shield size={20} className={accountType === "LIVE" ? "text-white" : ""} />
                  <span className="text-xs font-bold uppercase tracking-widest">Personal / Live</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setAccountType("PROP_FIRM")}
                  className={cn("p-4 rounded-xl border flex flex-col items-center gap-2 transition-all", accountType === "PROP_FIRM" ? "bg-brand-amber/10 border-brand-amber/30 text-brand-amber" : "bg-black border-white/5 text-white/40")}
                >
                  <Flag size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">Prop Firm</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                    {accountType === "PROP_FIRM" ? "Prop Firm Name" : "Account Name"}
                  </label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none text-sm" placeholder={accountType === "PROP_FIRM" ? "e.g. FTMO 100k Challenge" : "e.g. Main Swing Account"} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Starting Balance ($)</label>
                  <input required type="number" value={balance} onChange={e => setBalance(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none text-sm font-mono" />
                </div>

                {accountType === "PROP_FIRM" && (
                  <>
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <h4 className="text-xs font-bold text-brand-amber uppercase tracking-widest flex items-center gap-2"><Flag size={12}/> Challenge Parameters</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Profit Target ($)</label>
                          <input required type="number" value={profitTarget} onChange={e => setProfitTarget(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none text-sm font-mono" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Max Daily Drawdown ($)</label>
                          <input required type="number" value={maxDailyDrawdown} onChange={e => setMaxDailyDrawdown(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none text-sm font-mono" />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Max Total Drawdown ($)</label>
                          <input required type="number" value={maxTotalDrawdown} onChange={e => setMaxTotalDrawdown(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none text-sm font-mono" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button type="button" onClick={() => setView("list")} className="flex-1 py-2.5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 font-bold uppercase tracking-wider text-sm rounded-lg transition-colors">
                  Back
                </button>
                <button type="submit" disabled={loading} className="flex-[2] py-2.5 bg-brand-amber text-black font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-brand-amber/90 transition-colors disabled:opacity-50">
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
