"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinModal({ isOpen, onClose }: JoinModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-md bg-[#080808] border border-white/10 rounded-[32px] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
          >
            {/* Subtle top spotlight for the modal */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="relative z-10 text-2xl font-semibold text-white mb-2">Complete your sign up</h3>
            <p className="relative z-10 text-sm text-gray-400 mb-8">
              Enter your email below to secure your spot on the waitlist.
            </p>

            {/* The Form */}
            <div className="relative w-full rounded-full p-[1px] overflow-hidden group z-10">
              {/* Spinning Gradient Border */}
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,#ff7f11_70%,#ffb800_85%,#ffffff_100%)] animate-[spin_3s_linear_infinite]" />
              
              <form 
                className="relative flex items-center bg-[#050505] rounded-full p-1 w-full z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Simulate submission
                  alert("Successfully joined waitlist!");
                  onClose();
                }}
              >
                {/* Inverted White Vignette for the Input Form */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.05)_100%)] pointer-events-none z-0" />
                
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  autoFocus
                  className="relative flex-1 bg-transparent border-none outline-none text-white px-5 placeholder:text-gray-600 text-sm min-w-0 z-10"
                  required
                />
                <button 
                  type="submit"
                  className="relative bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10"
                >
                  Join
                </button>
              </form>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
