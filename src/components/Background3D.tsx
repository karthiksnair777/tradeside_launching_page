"use client";

import { motion } from "framer-motion";

export function Background3D() {
  // SVG Data URIs for fine, elegant sine wave textures
  const waveSvg1 = `url("data:image/svg+xml,%3Csvg width='160' height='40' viewBox='0 0 160 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 Q 40 40, 80 20 T 160 20' fill='none' stroke='%23ffcc00' stroke-width='0.75'/%3E%3C/svg%3E")`;
  const waveSvg2 = `url("data:image/svg+xml,%3Csvg width='100' height='24' viewBox='0 0 100 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 Q 25 24, 50 12 T 100 12' fill='none' stroke='%23ff5500' stroke-width='0.5'/%3E%3C/svg%3E")`;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505] overflow-hidden flex items-center justify-center">
      
      {/* 
        The Wave Texture Background:
        Instead of glowing gradients, this uses actual repeated sine wave textures 
        that scroll endlessly to create a precision, high-tech moving wave pattern.
      */}

      {/* Layer 1: Deep orange, finer wave texture scrolling faster */}
      <motion.div 
        className="absolute w-[200vw] h-[200vh] opacity-30 origin-center rotate-[-5deg]"
        style={{
          backgroundImage: waveSvg2,
          backgroundSize: '100px 24px',
        }}
        animate={{ x: ['0px', '-100px'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Layer 2: Bright yellowish, larger wave texture scrolling slightly slower */}
      <motion.div 
        className="absolute w-[200vw] h-[200vh] opacity-40 origin-center rotate-[2deg]"
        style={{
          backgroundImage: waveSvg1,
          backgroundSize: '160px 40px',
        }}
        animate={{ x: ['0px', '-160px'] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Heavy Cinematic Vignette to fade the wave textures perfectly into the pitch black edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#050505_90%)] z-10" />
      
    </div>
  );
}
