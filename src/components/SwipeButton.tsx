"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

interface SwipeButtonProps {
  onSuccess: () => void;
}

export function SwipeButton({ onSuccess }: SwipeButtonProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Opacity of the "Swipe to Join" text fades out as you drag
  const textOpacity = useTransform(x, [0, 150], [1, 0]);
  
  // Progress bar fills up as you drag
  const progressWidth = useTransform(x, [0, 300], ["0%", "100%"]);

  const handleDragEnd = (event: any, info: any) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const handleWidth = 56; // 14 * 4 (w-14)
    const maxDrag = containerWidth - handleWidth;

    // If dragged more than 85% of the way, count it as a success
    if (info.offset.x > maxDrag * 0.85) {
      setIsSuccess(true);
      controls.start({ x: maxDrag });
      
      // Trigger success callback after a tiny delay for the animation to finish
      setTimeout(() => {
        onSuccess();
        // Reset after modal opens
        setTimeout(() => {
          setIsSuccess(false);
          controls.start({ x: 0 });
        }, 500);
      }, 300);
    } else {
      // Snap back to start
      controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center bg-[#050505] rounded-full h-16 w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
    >
      {/* Inverted White Vignette for the background track */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.05)_100%)] pointer-events-none z-0" />
      
      {/* Fill progress background */}
      <motion.div 
        className="absolute top-0 left-0 h-full bg-white/5 pointer-events-none z-0"
        style={{ width: progressWidth }}
      />

      {/* Swipe Text */}
      <motion.div 
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <span className="text-gray-400 text-sm font-medium tracking-wide">Swipe to join the waitlist</span>
      </motion.div>

      {/* Draggable Handle */}
      <motion.div
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="absolute left-1 flex items-center justify-center w-14 h-14 bg-white rounded-full cursor-grab active:cursor-grabbing shadow-[0_0_15px_rgba(255,255,255,0.4)] z-20"
      >
        {isSuccess ? (
          <Check className="w-5 h-5 text-black" />
        ) : (
          <ArrowRight className="w-5 h-5 text-black" />
        )}
      </motion.div>
    </div>
  );
}
