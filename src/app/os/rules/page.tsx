"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { insforge } from "@/lib/insforge";
import { Shield, Settings, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function RulesEnginePage() {
  const { activeAccount } = useAccount();
  
  // Rule State
  const [rules, setRules] = useState<any[]>([]);
  const [ruleType, setRuleType] = useState("MAX_TRADES_DAY");
  const [ruleValue, setRuleValue] = useState("");
  const [loadingRule, setLoadingRule] = useState(false);

  useEffect(() => {
    fetchRules();
  }, [activeAccount]);

  const fetchRules = async () => {
    if (!activeAccount) return;
    try {
      const { data } = await insforge.database
        .from("trading_rules")
        .select("*")
        .eq("account_id", activeAccount.id);
      if (data) setRules(data);
    } catch (e) {
      console.error(e);
    }
  };



  const handleAddRule = async () => {
    if (!activeAccount || !ruleValue) return;
    setLoadingRule(true);
    try {
      await insforge.database.from("trading_rules").insert([{
        account_id: activeAccount.id,
        rule_type: ruleType,
        rule_value: ruleValue,
        is_active: true
      }]);
      setRuleValue("");
      fetchRules();
    } catch (e) {
      console.error(e);
      alert("Failed to add rule.");
    }
    setLoadingRule(false);
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await insforge.database.from("trading_rules").delete().eq("id", id);
      fetchRules();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleRule = async (id: string, current: boolean) => {
    try {
      await insforge.database.from("trading_rules").update({ is_active: !current }).eq("id", id);
      fetchRules();
    } catch (e) {
      console.error(e);
    }
  };



  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-black text-white space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Rule Engine & Prop Firm Mode</h1>
        <p className="text-gray-400">Define strict parameters to protect your capital and enforce discipline.</p>
      </header>

      <div className="max-w-3xl">
        
        {/* Rule Engine */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 min-w-0">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
              <Shield className="text-brand-amber w-6 h-6" />
              <h2 className="text-xl font-bold text-white/90">Personal Trading Rules</h2>
            </div>
            
            <p className="text-[11px] text-white/50 mb-6 leading-relaxed">
              Define your non-negotiable boundaries. The AI Coach uses these active rules to automatically grade your discipline and highlight violations in your Smart Journal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select value={ruleType} onChange={e => setRuleType(e.target.value)} className="flex-1 bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none text-sm min-w-0">
                <option value="MAX_TRADES_DAY">Max Trades Per Day</option>
                <option value="MAX_RISK_TRADE">Max Risk % Per Trade</option>
                <option value="ALLOWED_SESSIONS">Allowed Sessions (e.g. NY, London)</option>
                <option value="MAX_DRAWDOWN">Max Daily Drawdown %</option>
                <option value="NO_NEWS_TRADING">No Trading During High Impact News (Yes/No)</option>
              </select>
              <input 
                type="text" 
                value={ruleValue} 
                onChange={e => setRuleValue(e.target.value)}
                placeholder="Value (e.g. 3, 1.5, NY)"
                className="flex-1 bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:border-brand-amber outline-none text-sm min-w-0"
              />
              <button 
                onClick={handleAddRule}
                disabled={loadingRule || !ruleValue}
                className="px-6 py-2 bg-brand-amber text-black hover:bg-brand-amber/90 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 sm:w-auto w-full"
              >
                <Plus size={16} className="mr-1" /> Add
              </button>
            </div>

            <div className="space-y-3">
              {rules.length === 0 ? (
                <p className="text-sm text-white/40 text-center py-4">No rules defined. Add one above.</p>
              ) : (
                rules.map(rule => (
                  <div key={rule.id} className={cn("flex items-center justify-between p-4 rounded-lg border", rule.is_active ? "bg-[#111] border-white/10" : "bg-black border-white/5 opacity-50")}>
                    <div>
                      <h4 className="text-sm font-semibold text-white/90">{rule.rule_type.replace(/_/g, ' ')}</h4>
                      <p className="text-xs font-mono text-brand-amber mt-1">{rule.rule_value}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleToggleRule(rule.id, rule.is_active)} className="text-[10px] uppercase font-bold text-white/40 hover:text-white/80">
                        {rule.is_active ? "Disable" : "Enable"}
                      </button>
                      <button onClick={() => handleDeleteRule(rule.id)} className="text-rose-500 hover:text-rose-400 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>



      </div>
    </div>
  );
}
