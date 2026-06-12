"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Background3D() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";

  // SVG Data URIs for fine, elegant sine wave textures
  // Dark mode uses orange/yellow strokes, Light mode uses slate/blue strokes
  const waveSvg1 = isLight 
    ? `url("data:image/svg+xml,%3Csvg width='160' height='40' viewBox='0 0 160 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 Q 40 40, 80 20 T 160 20' fill='none' stroke='%2394a3b8' stroke-width='0.75'/%3E%3C/svg%3E")`
    : `url("data:image/svg+xml,%3Csvg width='160' height='40' viewBox='0 0 160 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 Q 40 40, 80 20 T 160 20' fill='none' stroke='%23ffcc00' stroke-width='0.75'/%3E%3C/svg%3E")`;
    
  const waveSvg2 = isLight
    ? `url("data:image/svg+xml,%3Csvg width='100' height='24' viewBox='0 0 100 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 Q 25 24, 50 12 T 100 12' fill='none' stroke='%23cbd5e1' stroke-width='0.5'/%3E%3C/svg%3E")`
    : `url("data:image/svg+xml,%3Csvg width='100' height='24' viewBox='0 0 100 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 Q 25 24, 50 12 T 100 12' fill='none' stroke='%23ff5500' stroke-width='0.5'/%3E%3C/svg%3E")`;

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${isLight ? 'bg-[#f8fafc]' : 'bg-[#050505]'} overflow-hidden flex items-center justify-center transition-colors duration-500`}>
      
      {/* Layer 1: Finer wave texture scrolling faster */}
      <motion.div 
        className={`absolute w-[200vw] h-[200vh] ${isLight ? 'opacity-40' : 'opacity-30'} origin-center rotate-[-5deg]`}
        style={{
          backgroundImage: waveSvg2,
          backgroundSize: '100px 24px',
        }}
        animate={{ x: ['0px', '-100px'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Layer 2: Larger wave texture scrolling slightly slower */}
      <motion.div 
        className={`absolute w-[200vw] h-[200vh] ${isLight ? 'opacity-50' : 'opacity-40'} origin-center rotate-[2deg]`}
        style={{
          backgroundImage: waveSvg1,
          backgroundSize: '160px 40px',
        }}
        animate={{ x: ['0px', '-160px'] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Heavy Cinematic Vignette to fade the wave textures perfectly into the edges */}
      <div className={`absolute inset-0 ${isLight ? 'bg-[radial-gradient(ellipse_at_center,transparent_10%,#f8fafc_90%)]' : 'bg-[radial-gradient(ellipse_at_center,transparent_10%,#050505_90%)]'} z-10 transition-colors duration-500`} />
      
    </div>
  );
}
