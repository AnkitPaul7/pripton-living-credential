"use client";

import { useEffect, useState } from "react";
import { Candidate } from "@/lib/mockData";
import { Flame, Clock, CalendarDays, Activity, Share2, Check } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";

interface CertificateBackProps {
  candidate: Candidate;
}

export function CertificateBack({ candidate }: CertificateBackProps) {
  const { dailyProgress, streak } = candidate;
  const [shiftedProgress, setShiftedProgress] = useState(dailyProgress);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents flipping the card
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${candidate.name}'s Living Credential`,
          text: `Check out ${candidate.name}'s verified exam journey and daily learning streak!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  useEffect(() => {
    // Add ±10% noise to the data to simulate "live" activity
    const noisyData = dailyProgress.map((day) => {
      const noiseFactor = 1 + (Math.random() * 0.2 - 0.1); // 0.9 to 1.1
      return {
        ...day,
        minutesActive: Math.max(0, Math.round(day.minutesActive * noiseFactor)),
      };
    });
    // Random noise must run only after mount (client-only) so the server-
    // rendered and first-hydrated markup match exactly — no hydration diff.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShiftedProgress(noisyData);
    setMounted(true);
  }, [dailyProgress]);

  const maxMinutes = Math.max(...shiftedProgress.map((d) => d.minutesActive), 1);
  const totalMinutes = shiftedProgress.reduce((acc, curr) => acc + curr.minutesActive, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="w-full h-full min-h-fit bg-white/90 sm:bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col justify-between border border-slate-900/10 text-slate-900 relative dark:bg-[#1b2b3a]/95 dark:sm:bg-[#1b2b3a]/92 dark:border-white/15 dark:text-white dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] dark:ring-1 dark:ring-white/[0.06]">
      {/* Subtle teal/emerald ambient highlight in corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-teal-500/15 via-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs sm:text-sm uppercase tracking-widest bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent font-bold">
              The Journey
            </span>
            <div className="flex items-center space-x-1 bg-teal-500/15 text-teal-700 dark:text-teal-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border border-teal-500/30">
              <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>Live Data</span>
            </div>
          </div>
          <h3 className="mb-2 font-serif text-2xl leading-tight font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Continuous Engagement
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
            Learning doesn&apos;t stop after the exam. Here is recent activity.
          </p>
        </div>

        {/* Back-face Share Button */}
        <button
          onClick={handleShare}
          className="shrink-0 flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/15 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-500/25 hover:border-teal-400/50"
          aria-label="Share this journey"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Stats row */}
      <motion.div
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 my-6 sm:my-8 relative z-10"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900/5 backdrop-blur-md rounded-2xl p-5 border border-slate-900/10 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 hover:border-teal-500/40 hover:shadow-[0_0_12px_rgba(45,212,191,0.15)] dark:bg-white/5 dark:border-white/10 dark:hover:border-teal-400/40 dark:hover:shadow-[0_0_12px_rgba(45,212,191,0.2)]"
        >
          <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 mb-2">
            <Flame className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span className="font-bold text-xs uppercase tracking-wider">Streak</span>
          </div>
          <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
            {streak}{" "}
            <span className="text-base text-slate-500 dark:text-slate-400 font-bold tracking-normal">days</span>
          </span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900/5 backdrop-blur-md rounded-2xl p-5 border border-slate-900/10 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 hover:border-teal-500/40 hover:shadow-[0_0_12px_rgba(45,212,191,0.15)] dark:bg-white/5 dark:border-white/10 dark:hover:border-teal-400/40 dark:hover:shadow-[0_0_12px_rgba(45,212,191,0.2)]"
        >
          <div className="flex items-center space-x-1.5 text-teal-600 dark:text-teal-400 mb-2">
            <Clock className="w-5 h-5 text-teal-600 dark:text-teal-300" />
            <span className="font-bold text-xs uppercase tracking-wider">Active</span>
          </div>
          <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
            {mounted ? totalMinutes : "--"}{" "}
            <span className="text-base text-slate-500 dark:text-slate-400 font-bold tracking-normal">min</span>
          </span>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-bold">
            Past 7 days
          </p>
        </motion.div>
      </motion.div>

      {/* Activity Chart */}
      <div className="flex-grow flex flex-col justify-end relative z-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">
          <div className="flex items-center space-x-1.5">
            <CalendarDays className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Activity History</span>
          </div>
          <span>(Minutes)</span>
        </div>

        <div className="h-28 sm:h-36 flex items-end justify-between space-x-2 sm:space-x-4">
          {shiftedProgress.map((day, idx) => {
            const heightPct = mounted ? (day.minutesActive / maxMinutes) * 100 : 0;
            const dateStr = format(parseISO(day.date), "EEE"); // e.g., Mon, Tue

            return (
              <div key={idx} className="flex flex-col items-center flex-1 group h-full justify-end">
                <div className="w-full relative flex justify-center h-full items-end pb-3">
                  {/* Tooltip */}
                  <div className="absolute -top-10 bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl scale-95 group-hover:scale-100 duration-200">
                    {mounted ? day.minutesActive : "--"} mins
                  </div>
                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 1, delay: idx * 0.1, type: "spring", bounce: 0.4 }}
                    className="w-full max-w-[2.5rem] bg-gradient-to-t from-teal-800 via-teal-600 to-emerald-500 dark:from-teal-950 dark:via-teal-600 dark:to-emerald-400 rounded-lg group-hover:to-emerald-400 group-hover:via-teal-500 dark:group-hover:to-emerald-300 dark:group-hover:via-teal-400 transition-colors duration-500 shadow-lg shadow-teal-500/20 relative"
                  >
                    <div className="absolute top-0 w-full h-1 bg-white/40 rounded-full" />
                  </motion.div>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                  {dateStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-900/10 dark:border-white/10 flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 relative z-10">
        <p>Live learning tracking</p>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
          <p className="text-slate-600 dark:text-slate-300">
            Sync:{" "}
            {mounted
              ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "--:--"}
          </p>
        </div>
      </div>
    </div>
  );
}
