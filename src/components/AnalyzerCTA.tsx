"use client";

import { motion } from "framer-motion";
import { Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AnalyzerCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full max-w-4xl mx-auto my-24 px-4"
    >
      <div className="glass-panel rounded-3xl p-8 md:p-12 text-center relative overflow-hidden group">
        {/* Animated Glow in the background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#D4AF37]/20 blur-[60px] rounded-full pointer-events-none transition-colors duration-700" />
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#D4AF37]">
            <Brain className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
            Why aren't you profitable?
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Take our free AI-powered psychology and performance assessment. Discover your hidden roadblocks, get a custom risk profile, and receive a 30-day action plan to achieve consistency.
          </p>
          
          <Link 
            href="/analyzer" 
            className="relative mt-4 w-full max-w-sm mx-auto py-4 rounded-xl font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#eab308] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group/btn"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            
            <span className="relative z-10">Start Free Analysis</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
