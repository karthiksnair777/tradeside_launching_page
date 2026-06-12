"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Background3D } from "@/components/Background3D";
import { AnalyzerWizard } from "@/components/Analyzer/AnalyzerWizard";
import { AnalyzerResults } from "@/components/Analyzer/AnalyzerResults";
import { AssessmentResults, generateReport } from "@/lib/analyzerLogic";

export default function AnalyzerPage() {
  const [results, setResults] = useState<AssessmentResults | null>(null);

  const handleComplete = (answers: Record<string, any>) => {
    const report = generateReport(answers);
    // Smooth scroll to top before showing results
    window.scrollTo({ top: 0, behavior: "smooth" });
    setResults(report);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden bg-white dark:bg-black selection:bg-brand-orange/30 transition-colors duration-300">
      <Background3D />
      
      <div className="relative z-10 w-full flex flex-col items-center pt-8">
        <Navbar />
      </div>

      {!results ? (
        <AnalyzerWizard onComplete={handleComplete} />
      ) : (
        <AnalyzerResults results={results} />
      )}
    </main>
  );
}
