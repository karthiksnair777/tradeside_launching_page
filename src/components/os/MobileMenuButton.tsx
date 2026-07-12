"use client";

import React from "react";
import { Menu } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export function MobileMenuButton() {
  const { setIsMobileOpen } = useSidebar();

  return (
    <button 
      onClick={() => setIsMobileOpen(true)}
      className="md:hidden relative p-2 text-foreground/60 hover:text-foreground transition-colors hover:bg-white/5 rounded-md"
    >
      <Menu size={20} />
    </button>
  );
}
