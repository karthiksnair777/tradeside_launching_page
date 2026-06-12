"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assessmentSections, Question } from "@/lib/analyzerLogic";

interface AnalyzerWizardProps {
  onComplete: (answers: Record<string, any>) => void;
}

export function AnalyzerWizard({ onComplete }: AnalyzerWizardProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Hero, 1 to 6 = Sections
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAnswer = (questionId: string, value: any, isMulti: boolean = false) => {
    setValidationError(null); // Clear error on answer
    if (isMulti) {
      setAnswers((prev) => {
        const current = prev[questionId] || [];
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter((v: string) => v !== value) };
        } else {
          // Allow max 3 selections for multi
          if (current.length >= 3) return prev;
          return { ...prev, [questionId]: [...current, value] };
        }
      });
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const currentSection = currentStep > 0 && currentStep <= assessmentSections.length 
    ? assessmentSections[currentStep - 1] 
    : null;

  const handleNext = () => {
    if (!currentSection) return;

    // Validation Check
    const missingAnswers = currentSection.questions.filter((q) => {
      const val = answers[q.id];
      if (q.type === 'multi') {
        return !val || val.length === 0;
      }
      return val === undefined || val === null || val === "";
    });

    if (missingAnswers.length > 0) {
      setValidationError(`Please answer the remaining ${missingAnswers.length} question(s) before proceeding.`);
      return;
    }

    setValidationError(null);

    if (currentStep < assessmentSections.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Complete
      setIsAnimating(true);
      setTimeout(() => {
        onComplete(answers);
      }, 1500); // Simulate processing time
    }
  };

  const handleStart = () => {
    setCurrentStep(1);
  };

  // Render Question
  const renderQuestion = (q: Question) => {
    const value = answers[q.id];

    if (q.type === 'scale') {
      return (
        <div key={q.id} className="flex flex-col gap-4 mb-8">
          <label className="text-black dark:text-white font-medium text-lg">{q.text}</label>
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-gray-500 w-16">Strongly Disagree</span>
            <div className="flex flex-1 justify-between gap-2 max-w-sm mx-auto">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAnswer(q.id, num)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    value === num 
                      ? 'bg-[#D4AF37] text-black scale-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                      : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500 w-16 text-right">Strongly Agree</span>
          </div>
        </div>
      );
    }

    if (q.type === 'single' || q.type === 'multi') {
      const isMulti = q.type === 'multi';
      return (
        <div key={q.id} className="flex flex-col gap-4 mb-8">
          <label className="text-black dark:text-white font-medium text-lg">
            {q.text} {isMulti && <span className="text-gray-500 text-sm font-normal">(Select up to 3)</span>}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options?.map((opt) => {
              const isSelected = isMulti ? (value || []).includes(opt) : value === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(q.id, opt, isMulti)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center pt-32 pb-24 px-4">
      {/* Container */}
      <div className="w-full max-w-[800px] flex flex-col relative z-10">
        
        <AnimatePresence mode="wait">
          
          {/* HERO VIEW */}
          {currentStep === 0 && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center gap-8 mt-12"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-semibold tracking-wide uppercase mb-4 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                TradeSide Analyzer
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-black via-black/80 to-gray-500 dark:from-white dark:via-white/90 dark:to-gray-500 drop-shadow-2xl">
                Discover Why You're Not Profitable Yet
              </h1>
              
              <div className="max-w-2xl flex flex-col gap-4 text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed">
                <p>
                  Most traders don't fail because of their strategy. They fail because of psychology, discipline, poor risk management, and emotional decision making.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Take this professional assessment and uncover the exact obstacles preventing your consistent profitability.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 mt-8">
                <button 
                  onClick={handleStart}
                  className="relative flex items-center justify-center gap-2 bg-[#D4AF37] text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] w-[200%] -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10">Start Free Analysis</span>
                </button>
                <span className="text-sm text-gray-500 font-medium">Estimated Time: 8–10 Minutes</span>
              </div>
            </motion.div>
          )}

          {/* QUESTIONS VIEW */}
          {currentStep > 0 && currentStep <= assessmentSections.length && currentSection && (
            <motion.div
              key={`section-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col"
            >
              {/* Progress Bar */}
              <div className="w-full flex items-center gap-4 mb-12">
                <div className="flex-1 h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / assessmentSections.length) * 100}%` }}
                    className="h-full bg-[#D4AF37]"
                  />
                </div>
                <span className="text-[#D4AF37] font-medium text-sm">
                  {currentStep} / {assessmentSections.length}
                </span>
              </div>

              <div className="w-full bg-white/60 dark:bg-[#050505] border border-black/10 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl dark:shadow-[0_30px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
                <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-8 border-b border-black/10 dark:border-white/10 pb-4">
                  {currentSection.title}
                </h2>

                <div className="flex flex-col gap-2">
                  {currentSection.questions.map(renderQuestion)}
                </div>

                <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    {validationError && (
                      <motion.p 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 font-medium text-sm"
                      >
                        {validationError}
                      </motion.p>
                    )}
                  </div>
                  <button 
                    onClick={handleNext}
                    className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shrink-0"
                  >
                    {currentStep === assessmentSections.length ? "Complete Assessment" : "Next Section"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* PROCESSING VIEW */}
          {isAnimating && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6"
            >
              <div className="w-16 h-16 border-4 border-black/10 dark:border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
              <h2 className="text-2xl font-bold text-black dark:text-white animate-pulse">Running AI Psychology Analysis...</h2>
              <p className="text-gray-600 dark:text-gray-400">Evaluating your emotional triggers and risk behavior.</p>
            </motion.div>
          )}
          
        </AnimatePresence>

      </div>
    </div>
  );
}
