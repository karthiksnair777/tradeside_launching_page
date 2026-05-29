"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Floating Pill Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center justify-center bg-[#050505]/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_0_40px_rgba(255,255,255,0.15)] min-w-[480px]"
      >
        <div className="flex items-center justify-center w-full gap-6">
          {/* Links (Desktop only) */}
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Partners</Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Testimonials</Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">FAQ</Link>

          {/* Separator (Desktop only) */}
          <div className="w-px h-5 bg-white/20 mx-2"></div>

          {/* 404 (Desktop only) */}
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors pr-2">
            404
          </Link>
        </div>
      </motion.nav>

      {/* Mobile Hamburger Button (Top Right) */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-8 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#050505]/40 backdrop-blur-xl border border-white/10 text-white shadow-lg transition-transform active:scale-95"
      >
        <Menu className="w-5 h-5 opacity-80" />
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[60] bg-black/60 flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-6 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/10 text-white transition-transform active:scale-95"
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
              <Link href="#" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white tracking-tight">Partners</Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white tracking-tight">Features</Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white tracking-tight">Testimonials</Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white tracking-tight">FAQ</Link>
              <div className="w-12 h-px bg-white/20 my-2" />
              <Link href="#" onClick={() => setIsOpen(false)} className="text-xl font-medium text-brand-orange">404</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
