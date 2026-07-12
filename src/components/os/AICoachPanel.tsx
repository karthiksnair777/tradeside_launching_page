"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, Send, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { insforge } from "@/lib/insforge";
import { useAccount } from "@/contexts/AccountContext";
import { aiService } from "@/lib/ai";

export function AICoachPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { activeAccount } = useAccount();
  const [messages, setMessages] = useState<{ role: "system" | "user", content: string }[]>([
    { role: "system", content: "I'm your AI Trading Coach. I have access to your entire trading journal, rules, and DNA. Ask me anything about your performance or psychology." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Cache trades so AI has context
  const [contextTrades, setContextTrades] = useState<any[]>([]);

  useEffect(() => {
    if (activeAccount) {
      insforge.database.from("trades").select("*").eq("account_id", activeAccount.id).then(({ data }) => {
        if (data) setContextTrades(data);
      });
    }
  }, [activeAccount]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await aiService.answerQuestion(userMsg, contextTrades);
      setMessages(prev => [...prev, { role: "system", content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "system", content: "I'm having trouble analyzing your journal right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[380px] bg-[#050505] border-l border-white/[0.04] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/[0.04] flex items-center justify-between bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-amber/10 flex items-center justify-center border border-brand-amber/20 relative">
                  <Brain size={16} className="text-brand-amber" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-[#0a0a0a]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white/90">AI Trading Memory</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Online</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded hover:bg-white/5 text-white/40 hover:text-white/90 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={cn(
                    "flex max-w-[85%] flex-col",
                    msg.role === "user" ? "ml-auto" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-brand-amber/10 text-white/90 border border-brand-amber/20 rounded-tr-sm" 
                      : "bg-[#111] text-white/80 border border-white/5 rounded-tl-sm"
                  )}>
                    {msg.content}
                  </div>
                  <span className={cn(
                    "text-[9px] text-white/30 uppercase tracking-wider font-semibold mt-1.5",
                    msg.role === "user" ? "text-right" : "text-left"
                  )}>
                    {msg.role === "user" ? "You" : "AI Coach"}
                  </span>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex max-w-[85%] mr-auto flex-col">
                  <div className="p-4 rounded-2xl bg-[#111] border border-white/5 rounded-tl-sm flex items-center gap-1.5 w-16">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-brand-amber/60" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-brand-amber/60" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-brand-amber/60" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setInput("What is my biggest weakness?")} className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-[10px] text-white/60 hover:text-white/90 transition-colors">"What is my biggest weakness?"</button>
                  <button onClick={() => setInput("Which setup performs best?")} className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-[10px] text-white/60 hover:text-white/90 transition-colors">"Which setup performs best?"</button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/[0.04] bg-[#0a0a0a]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your trading memory..."
                  className="w-full bg-[#111] border border-white/[0.06] rounded-full pl-4 pr-12 py-3 text-sm text-white/90 focus:outline-none focus:border-brand-amber/40 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 p-2 bg-brand-amber text-black rounded-full hover:bg-brand-amber/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
