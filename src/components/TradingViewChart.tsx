"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !container.current) return;
    
    // Clear container to reload chart on theme change
    container.current.innerHTML = '<div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%"></div>';
    
    const isLight = theme === 'light';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "OANDA:XAUUSD",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "${isLight ? 'light' : 'dark'}",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "${isLight ? '#ffffff' : '#080808'}",
        "gridColor": "${isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)'}",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview_xauusd",
        "support_host": "https://www.tradingview.com"
      }`;
    
    container.current.appendChild(script);
  }, [mounted, theme]);

  if (!mounted) return <div className="w-full h-full bg-[#080808] dark:bg-white rounded-3xl animate-pulse"></div>;

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export const TradingViewChart = TradingViewWidget;
