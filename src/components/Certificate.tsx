"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Candidate } from "@/lib/mockData";
import { CertificateFront } from "./CertificateFront";
import { CertificateBack } from "./CertificateBack";
import { AuroraBlobs } from "./AuroraBlobs";
import { RefreshCw } from "lucide-react";

interface CertificateProps {
  candidate: Candidate;
}

export function Certificate({ candidate }: CertificateProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Keyboard support for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  const flipTransition = {
    duration: 0.6,
    ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Dynamic Aurora & Grain Background extending behind the full card height */}
      <AuroraBlobs
        side={isFlipped ? "back" : "front"}
        className="-inset-8 sm:-inset-16 md:-inset-24"
      />

      {/* Card Header Toolbar / Docked Flip Control */}
      <div className="no-print z-10 mb-4 sm:mb-6 flex w-full items-center justify-between px-1">
        <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          {isFlipped ? "Journey & Live Progress" : "Official Credential"}
        </span>

        <motion.button
          onClick={handleFlip}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-900/5 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-xl shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:border-slate-900/20 hover:bg-slate-900/10 hover:text-slate-900 focus:ring-2 focus:ring-indigo-400/50 focus:outline-none dark:border-white/15 dark:bg-white/10 dark:text-slate-200 dark:shadow-black/30 dark:hover:border-white/30 dark:hover:bg-white/15 dark:hover:text-white"
          aria-label={`Flip certificate to ${isFlipped ? "front" : "back"}`}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFlipped ? "rotate-180 text-teal-500 dark:text-teal-300" : "text-amber-500 dark:text-amber-300"} transition-all duration-500`}
          />
          <span>View {isFlipped ? "Achievement (Front)" : "Journey (Back)"}</span>
        </motion.button>
      </div>

      {/* 3D Container - Sized to fit content naturally without forced internal scrolling */}
      <motion.div
        whileHover={{ scale: 1.006 }}
        whileTap={{ scale: 0.995 }}
        transition={{ duration: 0.2 }}
        className="perspective-1000 group relative w-full min-h-[580px] sm:min-h-[620px] cursor-pointer outline-none z-10"
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={isFlipped}
      >
        <motion.div
          className="w-full min-h-[580px] sm:min-h-[620px] relative preserve-3d"
          animate={{
            rotateY: isFlipped && !shouldReduceMotion ? 180 : 0,
            opacity: isFlipped && shouldReduceMotion ? 0 : 1,
          }}
          transition={flipTransition}
          style={{
            backfaceVisibility: "hidden",
            display: shouldReduceMotion && isFlipped ? "none" : "block",
            position: shouldReduceMotion ? "absolute" : "relative",
          }}
        >
          <CertificateFront candidate={candidate} />
        </motion.div>

        <motion.div
          className="w-full min-h-[580px] sm:min-h-[620px] absolute top-0 left-0 preserve-3d"
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{
            rotateY: isFlipped && !shouldReduceMotion ? 0 : 180,
            opacity: isFlipped || !shouldReduceMotion ? 1 : 0,
          }}
          transition={flipTransition}
          style={{
            backfaceVisibility: "hidden",
            display: shouldReduceMotion && !isFlipped ? "none" : "block",
          }}
        >
          <CertificateBack candidate={candidate} />
        </motion.div>
      </motion.div>

      <p className="no-print mt-5 sm:mt-6 flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 opacity-90 z-10">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-500/60 dark:bg-slate-400/60" />
        <span className="hidden sm:inline">Click card or press Space to flip sides</span>
        <span className="sm:hidden">Tap card to flip sides</span>
      </p>
    </div>
  );
}
