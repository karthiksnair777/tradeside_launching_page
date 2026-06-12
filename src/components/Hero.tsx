"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-orange/30 bg-brand-orange/10 text-brand-orange text-sm font-medium tracking-wide uppercase shadow-[0_0_20px_rgba(255,127,17,0.2)]"
      >
        <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
        System Initializing
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black via-black/80 to-gray-500 dark:from-white dark:via-white dark:to-gray-500 drop-shadow-2xl"
      >
        TradeSide
      </motion.h1>

      {/* Sub-headline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 text-2xl md:text-3xl font-light tracking-wide text-gray-700 dark:text-gray-300"
      >
        <span className="text-black dark:text-white font-medium">Precision.</span> Patience. Execution.
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light"
      >
        A next-generation trading ecosystem focused on discipline, psychology, and market clarity.
      </motion.p>
    </div>
  );
}
