"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AuroraBlobsProps {
  side?: "front" | "back";
  pulse?: boolean;
  className?: string;
}

export function AuroraBlobs({
  side = "front",
  pulse = false,
  className = "",
}: AuroraBlobsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (pulse) {
      // Synchronizes with the `pulse` prop's rising edge (a one-shot timed
      // animation), not derivable from render — safe to set state here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPulsing(true);
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pulse]);

  const isFront = side === "front";

  // Drift animations for the 3 radial blobs (15s, 20s, 25s ease-in-out loops)
  // When prefers-reduced-motion is true, motion is frozen
  const blob1Drift = shouldReduceMotion
    ? {}
    : {
        x: [0, 45, -30, 20, 0],
        y: [0, -35, 25, -15, 0],
        scale: [1, 1.15, 0.9, 1.08, 1],
        transition: {
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const blob2Drift = shouldReduceMotion
    ? {}
    : {
        x: [0, -40, 35, -20, 0],
        y: [0, 30, -30, 20, 0],
        scale: [1, 0.88, 1.18, 0.95, 1],
        transition: {
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const blob3Drift = shouldReduceMotion
    ? {}
    : {
        x: [0, 25, -35, 15, 0],
        y: [0, -25, 30, -20, 0],
        scale: [1, 1.1, 0.92, 1.05, 1],
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  // Crossfade transition duration: exactly 400ms synced with flip
  const crossfadeTransition = {
    duration: 0.4,
    ease: "easeInOut" as const,
  };

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Base foundation — removed so parent background can show through */}

      {/* Blob 1: Top-Left / Floating */}
      <motion.div
        animate={blob1Drift}
        className={`absolute -top-24 -left-24 h-80 w-80 rounded-full blur-[90px] sm:h-96 sm:w-96 md:h-[32rem] md:w-[32rem] md:blur-[120px] transition-all duration-300 ${
          isPulsing ? "scale-125 opacity-100" : ""
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Front-side accent: Indigo -> Violet (#6366f1 -> #a855f7) */}
        <motion.div
          animate={{ opacity: isFront ? (isPulsing ? 0.9 : 0.65) : 0 }}
          transition={crossfadeTransition}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-transparent"
        />
        {/* Back-side accent: Teal -> Emerald (#2dd4bf -> #34d399) */}
        <motion.div
          animate={{ opacity: !isFront ? (isPulsing ? 0.9 : 0.65) : 0 }}
          transition={crossfadeTransition}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2dd4bf] via-[#34d399] to-transparent"
        />
      </motion.div>

      {/* Blob 2: Bottom-Right / Floating */}
      <motion.div
        animate={blob2Drift}
        className={`absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-[90px] sm:h-96 sm:w-96 md:h-[32rem] md:w-[32rem] md:blur-[120px] transition-all duration-300 ${
          isPulsing ? "scale-125 opacity-100" : ""
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Front-side accent: Violet -> Deep Blue */}
        <motion.div
          animate={{ opacity: isFront ? (isPulsing ? 0.85 : 0.55) : 0 }}
          transition={crossfadeTransition}
          className="absolute inset-0 rounded-full bg-gradient-to-tl from-[#a855f7] via-[#3b82f6] to-transparent"
        />
        {/* Back-side accent: Emerald -> Cyan/Teal */}
        <motion.div
          animate={{ opacity: !isFront ? (isPulsing ? 0.85 : 0.55) : 0 }}
          transition={crossfadeTransition}
          className="absolute inset-0 rounded-full bg-gradient-to-tl from-[#34d399] via-[#06b6d4] to-transparent"
        />
      </motion.div>

      {/* Blob 3: Center Ambient Glow */}
      <motion.div
        animate={blob3Drift}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full blur-[80px] sm:h-96 sm:w-96 md:h-[28rem] md:w-[28rem] md:blur-[110px] transition-all duration-300 ${
          isPulsing ? "scale-130 opacity-90" : ""
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Front-side accent: Royal achievement core — a touch of gold amid indigo/violet */}
        <motion.div
          animate={{ opacity: isFront ? (isPulsing ? 0.6 : 0.35) : 0 }}
          transition={crossfadeTransition}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6366f1]/60 via-[#a855f7]/40 to-[#f59e0b]/30"
        />
        {/* Back-side accent: Growth / Journey core */}
        <motion.div
          animate={{ opacity: !isFront ? (isPulsing ? 0.6 : 0.35) : 0 }}
          transition={crossfadeTransition}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2dd4bf]/60 via-[#10b981]/40 to-[#3b82f6]/30"
        />
      </motion.div>

      {/* Static SVG feTurbulence Noise/Grain Layer (4-8% opacity, mix-blend-overlay) */}
      <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
