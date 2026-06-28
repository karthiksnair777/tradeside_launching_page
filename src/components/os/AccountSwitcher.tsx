"use client";

import React, { useState } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { ChevronDown, Plus, Briefcase, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { insforge } from "@/lib/insforge";

export function AccountSwitcher() {
  const { accounts, activeAccount, setActiveAccount, refreshAccounts } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New account form
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const handleCreateAccount = async () => {
    if (!name || !balance) return;
    setLoading(true);
    
    const { error } = await insforge.database.from("trading_accounts").insert([{
      name,
      initial_balance: parseFloat(balance),
      currency: "USD"
    }]);

    if (!error) {
      await refreshAccounts();
      setIsModalOpen(false);
      setName("");
      setBalance("");
    } else {
      alert("Error creating account. Make sure you ran the SQL migration.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="relative z-50">
      {/* Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0a0a0a] border border-white/[0.04] hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-5 h-5 rounded-sm bg-brand-amber/10 flex items-center justify-center text-brand-amber">
          <Briefcase size={10} />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-[9px] uppercase tracking-widest text-white/40 font-semibold leading-none mb-0.5">Account</span>
          <span className="text-xs font-bold text-white/90 leading-none">
            {activeAccount ? activeAccount.name : "Select Account"}
          </span>
        </div>
        <ChevronDown size={14} className={cn("text-white/40 transition-transform ml-1", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-56 rounded-md bg-[#0a0a0a] border border-white/[0.08] shadow-xl overflow-hidden z-50 py-1">
            <div className="px-3 py-2 border-b border-white/[0.04]">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Your Accounts</span>
            </div>
            
            <div className="max-h-48 overflow-y-auto py-1 scrollbar-hide">
              {accounts.length === 0 && (
                <div className="px-3 py-2 text-xs text-white/40">No accounts found.</div>
              )}
              {accounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => {
                    setActiveAccount(acc);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-white/[0.02] transition-colors",
                    activeAccount?.id === acc.id ? "bg-white/[0.04] text-white" : "text-white/60"
                  )}
                >
                  <span className="font-semibold">{acc.name}</span>
                  <span className="font-mono text-white/40">${acc.initial_balance.toLocaleString()}</span>
                </button>
              ))}
            </div>
            
            <div className="border-t border-white/[0.04] p-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-brand-amber hover:bg-brand-amber/10 rounded transition-colors font-semibold"
              >
                <Plus size={12} /> Add New Account
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#050505] border border-white/[0.08] p-6 rounded-xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                <Wallet size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white/90 leading-tight">New Account</h2>
                <p className="text-xs text-white/40">Set up a new trading portfolio</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Account Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. FTMO 100k"
                  className="w-full bg-[#111] border border-white/[0.06] rounded px-3 py-2 text-sm text-white/90 focus:outline-none focus:border-brand-amber/50" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Initial Balance ($)</label>
                <input 
                  type="number" 
                  value={balance} 
                  onChange={e => setBalance(e.target.value)} 
                  placeholder="100000"
                  className="w-full bg-[#111] border border-white/[0.06] rounded px-3 py-2 text-sm text-white/90 focus:outline-none focus:border-brand-amber/50 font-mono" 
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 rounded border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateAccount}
                disabled={loading || !name || !balance}
                className="flex-1 py-2 rounded bg-brand-amber text-[#0a0a0a] text-xs font-bold uppercase tracking-wider hover:bg-brand-amber/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
