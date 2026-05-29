import { cn } from "@/lib/utils";

export function Logo({ className, variant = "outline" }: { className?: string; variant?: "outline" | "solid" }) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="flex items-baseline relative">
        <span className={cn("text-5xl font-extrabold tracking-[-0.03em]", variant === "outline" ? "text-outline" : "text-white")}>
          TradeSide
        </span>
        <span className="text-brand-amber text-6xl font-black leading-[0] ml-0.5 relative top-[-0.1em]">.</span>
      </div>
      <div className="flex items-center justify-between w-full mt-2 px-1.5">
        <span className="text-white text-[10px] md:text-[11px] font-medium tracking-[0.25em]">PRECISION</span>
        <span className="text-[#a855f7] text-[10px] md:text-[11px] font-medium tracking-[0.25em] mx-2">OVER</span>
        <span className="text-white text-[10px] md:text-[11px] font-medium tracking-[0.25em]">EMOTION</span>
      </div>
    </div>
  );
}
