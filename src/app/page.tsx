"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Background3D } from "@/components/Background3D";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { SwipeButton } from "@/components/SwipeButton";
import { JoinModal } from "@/components/JoinModal";
import { TradingViewChart } from "@/components/TradingViewChart";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden bg-black selection:bg-brand-orange/30">
      <Background3D />
      
      {/* Absolute Logo on Left Side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-8 left-6 md:left-10 z-50 scale-[0.3] md:scale-[0.45] origin-top-left"
      >
        <Logo variant="solid" />
      </motion.div>

      <div className="relative z-10 w-full flex flex-col items-center pt-8">
        <Navbar />
        
        {/* Spacer since we removed the waitlist pill */}
        <div className="mt-[60px] mb-4"></div>

        {/* Hero Text */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-[67px] lg:text-[93px] font-bold tracking-[-0.07em] text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#4a4a4a] mb-12 drop-shadow-2xl px-4 text-center leading-none"
        >
          Coming soon!
        </motion.h1>

        {/* Waitlist Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[590px] px-4"
        >
          <div className="relative w-full rounded-[40px] p-[1px] overflow-hidden group">
            {/* Animated moving line border */}
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ffffff_100%)] animate-[spin_4s_linear_infinite]" />
            
            <div className="relative w-full bg-[#080808] backdrop-blur-2xl rounded-[40px] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-10 overflow-hidden">
              
              {/* Spotlight from center top to mid bottom (Narrowed focus) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[100%] bg-[radial-gradient(ellipse_30%_100%_at_50%_0%,rgba(255,255,255,0.3),transparent)] pointer-events-none" />
              
              {/* Inverted White Vignette (white glowing edges fading to transparent center) - opacity reduced */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.05)_100%)] pointer-events-none" />
              
              {/* Top Inner Shadow / Rim Light */}
              <div className="absolute inset-0 rounded-[40px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_0_60px_rgba(255,255,255,0.02)] pointer-events-none" />

              <h2 className="relative z-20 text-3xl md:text-4xl font-semibold tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#6b7280] text-center mb-4 pb-1">
                Join our waitlist!
              </h2>
              <p className="relative z-20 text-sm text-gray-400 text-center mb-10 max-w-sm mx-auto leading-relaxed">
                Sign up for our newsletter to receive the latest updates and insights straight to your inbox.
              </p>
              
              <div className="relative z-20 max-w-md mx-auto w-full mt-4">
                {/* Glow behind the button to match the image */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-16 bg-white/25 blur-[25px] rounded-full pointer-events-none z-0" />
                
                {/* Animated Form Wrapper replaced by SwipeButton */}
                <div className="relative w-full rounded-full p-[1px] overflow-hidden group z-10">
                  {/* Spinning Gradient Border */}
                  <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,#ff7f11_70%,#ffb800_85%,#ffffff_100%)] animate-[spin_3s_linear_infinite]" />
                  
                  <SwipeButton onSuccess={() => setIsModalOpen(true)} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Socials */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex items-center gap-4 pb-12"
        >
          {['X', 'F', 'I'].map(icon => (
            <button key={icon} className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all cursor-pointer">
              <span className="text-sm font-medium">{icon}</span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Live Market Data Section */}
      <section className="relative z-10 w-full min-h-screen flex flex-col items-center py-24 px-4">
        <div className="w-full max-w-[1200px] flex flex-col gap-8">
          
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 drop-shadow-2xl">
              Live Market Data
            </h2>
            <p className="max-w-2xl text-sm md:text-base leading-relaxed text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-500">
              Track XAUUSD in real-time with our advanced institutional charting integration.
            </p>
          </div>

          {/* Chart Container */}
          <div className="relative w-full h-[600px] md:h-[700px] rounded-3xl p-[1px] overflow-hidden group">
            {/* Spinning Gradient Border for Chart */}
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,#ff7f11_70%,#ffb800_85%,#ffffff_100%)] animate-[spin_5s_linear_infinite]" />
            
            <div className="relative w-full h-full bg-[#050505] rounded-3xl p-4 md:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-10 overflow-hidden">
              {/* Inner Rim Light */}
              <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_0_60px_rgba(255,255,255,0.02)] pointer-events-none z-20" />
              
              <TradingViewChart />
            </div>
          </div>
          
        </div>
      </section>

      {/* Modern Big Footer */}
      <footer className="relative z-10 w-full bg-[#030303] border-t border-white/5 pt-20 pb-8 px-4 overflow-hidden mt-auto">
        
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[100px] bg-[radial-gradient(ellipse_at_top,rgba(255,127,17,0.1),transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-[1200px] mx-auto flex flex-col relative z-10">
          
          {/* Top Section: Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 flex flex-col items-start gap-6">
              <div className="scale-90 origin-left -ml-2">
                <Logo variant="solid" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                The next generation of institutional-grade charting and trading tools. Built for speed, precision, and absolute performance.
              </p>
              <div className="flex items-center gap-3 mt-2">
                {['X', 'F', 'I', 'in'].map(icon => (
                  <button key={icon} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                    <span className="text-xs font-medium">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold mb-2">Product</h4>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Integrations</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Changelog</a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold mb-2">Company</h4>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold mb-2">Legal</h4>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
            
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/5 mb-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} Tradeside Inc. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
          
        </div>

        {/* Massive Background Text */}
        <div className="absolute bottom-[-4rem] md:bottom-[-6rem] left-1/2 -translate-x-1/2 w-full overflow-hidden flex justify-center pointer-events-none opacity-[0.03] select-none">
          <h1 className="text-[120px] md:text-[200px] lg:text-[280px] font-black tracking-tighter leading-none text-white whitespace-nowrap">
            TRADESIDE
          </h1>
        </div>

      </footer>

      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
