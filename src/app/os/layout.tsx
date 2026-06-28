import React from "react";
import { Sidebar } from "@/components/os/Sidebar";
import { GlobalSearch } from "@/components/os/GlobalSearch";
import { Bell, User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal OS | TradeSide",
  description: "Advanced institutional trading psychology and performance analysis.",
};

import { AccountProvider } from "@/contexts/AccountContext";
import { AccountSwitcher } from "@/components/os/AccountSwitcher";

export default function OSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Force dark mode context for the OS section by wrapping in a div with "dark" class
    // assuming we want it strictly dark mode as requested: "Dark mode only (matching TradeSide)"
    <div className="dark bg-bg-primary text-foreground min-h-screen flex selection:bg-brand-amber/30 font-sans">
      <AccountProvider>
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top Navigation Bar */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border-color bg-bg-primary/80 backdrop-blur-xl z-30 sticky top-0">
            <div className="flex items-center gap-4 flex-1">
              <AccountSwitcher />
              <GlobalSearch />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-foreground/60 hover:text-foreground transition-colors hover:bg-white/5 rounded-full">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-amber rounded-full border border-bg-primary"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-amber flex items-center justify-center text-bg-primary shadow-lg cursor-pointer">
                <User size={16} />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-amber/5 via-bg-primary to-bg-primary">
            <div className="max-w-[1600px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </AccountProvider>
    </div>
  );
}
