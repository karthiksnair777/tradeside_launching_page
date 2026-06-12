"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Desktop Floating Pill Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center justify-center bg-white/60 dark:bg-[#050505]/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-full px-6 py-2 shadow-2xl min-w-[480px] transition-colors duration-300"
      >
        <div className="flex items-center justify-center w-full gap-6">
          {/* Links (Desktop only) */}
          <Link href="#" className="text-sm font-medium text-black/60 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Partners</Link>
          <Link href="#" className="text-sm font-medium text-black/60 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Features</Link>
          <Link href="#" className="text-sm font-medium text-black/60 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Testimonials</Link>
          <Link href="#" className="text-sm font-medium text-black/60 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">FAQ</Link>

          {/* Separator (Desktop only) */}
          <div className="w-px h-5 bg-black/10 dark:bg-white/20 mx-2 transition-colors"></div>

          {/* Theme Toggle (Desktop) */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-8 h-8 rounded-full text-black/80 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* 404 (Desktop only) */}
          <Link href="#" className="text-sm font-medium text-black/60 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors pr-2">
            404
          </Link>
        </div>
      </motion.nav>

      {/* Mobile Buttons (Top Right) */}
      <div className="md:hidden fixed top-8 right-6 z-50 flex items-center gap-3">
        {mounted && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/60 dark:bg-[#050505]/40 backdrop-blur-xl border border-black/10 dark:border-white/10 text-black dark:text-white shadow-lg transition-transform active:scale-95"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 opacity-80" /> : <Moon className="w-5 h-5 opacity-80" />}
          </motion.button>
        )}

        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white/60 dark:bg-[#050505]/40 backdrop-blur-xl border border-black/10 dark:border-white/10 text-black dark:text-white shadow-lg transition-transform active:scale-95"
        >
          <Menu className="w-5 h-5 opacity-80" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[60] bg-white/80 dark:bg-black/60 flex flex-col items-center justify-center transition-colors duration-300"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-6 flex items-center justify-center w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-black dark:text-white transition-transform active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="flex flex-col items-center gap-8"
            >
              <Link href="#" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-black dark:text-white tracking-tight">Partners</Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-black dark:text-white tracking-tight">Features</Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-black dark:text-white tracking-tight">Testimonials</Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-black dark:text-white tracking-tight">FAQ</Link>
              <div className="w-12 h-px bg-black/20 dark:bg-white/20 my-2" />
              <Link href="#" onClick={() => setIsOpen(false)} className="text-xl font-medium text-brand-orange">404</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
