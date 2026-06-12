"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export function WaitlistCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="relative z-10 w-full max-w-md mx-auto mt-12 mb-32"
    >
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group">
        {/* Animated Glow in the background of the card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-orange/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-brand-orange/30 transition-colors duration-700"></div>

        <h3 className="text-2xl font-semibold text-black dark:text-white mb-2 text-center">Join the Waitlist</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8">
          Be first to access the future of disciplined trading.
        </p>

        <form className="relative flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 w-5 h-5 text-gray-500" />
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange/50 focus:bg-black/10 dark:focus:bg-white/10 transition-all duration-300"
            />
          </div>
          
          <button
            type="submit"
            className="relative w-full py-4 rounded-xl font-medium text-black bg-gradient-to-r from-brand-amber to-brand-orange hover:shadow-[0_0_30px_rgba(255,127,17,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></span>
            
            <span className="relative z-10">Secure Early Access</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
