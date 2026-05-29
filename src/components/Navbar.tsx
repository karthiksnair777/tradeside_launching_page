"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center bg-[#050505]/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_0_40px_rgba(255,255,255,0.15)] min-w-[320px] md:min-w-[480px]"
    >
      <div className="flex items-center justify-between w-full gap-4">

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 px-4">
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Partners</Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Testimonials</Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">FAQ</Link>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-5 bg-white/20 mx-2"></div>

        {/* 404 */}
        <Link href="#" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors pr-2">
          404
        </Link>
      </div>
    </motion.nav>
  );
}
