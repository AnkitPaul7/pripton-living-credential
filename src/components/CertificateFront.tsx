"use client";

import { Candidate } from "@/lib/mockData";
import { CheckCircle2, XCircle, Award, BadgeCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface CertificateFrontProps {
  candidate: Candidate;
}

export function CertificateFront({ candidate }: CertificateFrontProps) {
  const { name, examName, examDate, score, maxScore, passed, syllabus } = candidate;
  const percentage = Math.round((score / maxScore) * 100);

  const shouldReduceMotion = useReducedMotion();
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      // Skips the rAF count-up entirely for reduced-motion users; setting
      // the final value directly is the intended one-shot effect, not a
      // value derivable from render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayScore(score);
      return;
    }

    // Animated count up for the score
    let startTimestamp: number | null = null;
    const duration = 1500; // 1.5 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayScore(Math.floor(easeProgress * score));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [score, shouldReduceMotion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <div
      id="certificate-front-export"
      data-certificate-front="true"
      className="w-full h-full min-h-fit bg-white/90 sm:bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col justify-between border border-slate-900/10 text-slate-900 relative dark:bg-[#23233f]/95 dark:sm:bg-[#23233f]/92 dark:border-white/15 dark:text-white dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] dark:ring-1 dark:ring-white/[0.06]"
    >
      {/* Subtle warm amber/rose ambient highlight in corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header section with clean badge separation */}
      <div className="flex flex-row justify-between items-start gap-4 mb-6 sm:mb-8 relative z-10">
        <div className="flex-1 pr-2">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs sm:text-sm uppercase tracking-widest bg-gradient-to-r from-amber-500 to-rose-500 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent font-bold">
              Achievement
            </span>
            <div className="flex items-center space-x-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border border-amber-500/30">
              <BadgeCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Verified</span>
            </div>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl leading-tight font-bold tracking-tight text-slate-900 dark:text-white">
            {name}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-1 font-medium">{examName}</p>
        </div>

        <div className="shrink-0 bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 p-3 sm:p-4 rounded-2xl ring-1 ring-white/20 shadow-xl shadow-black/40 text-white">
          <Award className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </div>

      {/* Score section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900/5 backdrop-blur-md rounded-2xl p-5 sm:p-6 mb-8 flex items-center justify-between border border-slate-900/10 shadow-lg relative z-10 dark:bg-white/5 dark:border-white/10"
      >
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            Final Score
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
              {displayScore}
            </span>
            <span className="text-xl text-slate-500 dark:text-slate-400 font-bold">/ {maxScore}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xl sm:text-2xl font-black text-slate-600 dark:text-slate-300 mb-2 tabular-nums">
            {percentage}%
          </div>
          {passed ? (
            <div className="flex items-center text-emerald-700 dark:text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
              Passed
            </div>
          ) : (
            <div className="flex items-center text-rose-700 dark:text-rose-300 bg-rose-500/20 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm border border-rose-500/30">
              <XCircle className="w-4 h-4 mr-1.5 text-rose-600 dark:text-rose-400" />
              Failed
            </div>
          )}
        </div>
      </motion.div>

      {/* Syllabus section — stops propagation so expanding a module doesn't
          also trigger the card's flip handler on the ancestor click/keydown. */}
      <div
        className="flex-grow relative z-10"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest">
          Syllabus Coverage
        </h3>
        {syllabus && syllabus.length > 0 ? (
          <motion.div
            variants={shouldReduceMotion ? undefined : containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {syllabus.map((syl, idx) => (
              <motion.details
                variants={itemVariants}
                key={idx}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="group overflow-hidden rounded-xl border border-slate-900/10 bg-slate-900/[0.03] backdrop-blur-md shadow-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_12px_rgba(245,158,11,0.2)] [&_summary::-webkit-details-marker]:hidden dark:border-white/10 dark:bg-white/5 dark:hover:border-amber-400/50 dark:hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 bg-black/[0.02] transition-colors duration-200 group-hover:bg-amber-500/10 dark:bg-white/[0.03]">
                  <span className="font-semibold text-slate-700 text-sm group-hover:text-amber-700 transition-colors dark:text-slate-200 dark:group-hover:text-amber-200">
                    {syl.module}
                  </span>
                  <span className="transition-transform duration-300 group-open:rotate-180 text-slate-500 group-hover:text-amber-600 dark:text-slate-400 dark:group-hover:text-amber-300">
                    <svg
                      fill="none"
                      height="18"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="18"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <div className="px-5 py-4 bg-black/[0.03] border-t border-slate-900/5 dark:bg-black/20 dark:border-white/5">
                  <ul className="space-y-2">
                    {syl.topics.map((topic, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                        <span className="mr-2 text-amber-600/70 dark:text-amber-400/70 mt-0.5">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.details>
            ))}
          </motion.div>
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400 italic bg-slate-900/5 dark:bg-white/5 p-6 rounded-xl border border-slate-900/10 dark:border-white/10 text-center">
            Syllabus information is unavailable for this candidate.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-900/10 dark:border-white/10 flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 relative z-10">
        <p>
          Issued on{" "}
          {new Date(examDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
          <p className="text-slate-600 dark:text-slate-300">Northlight Academy</p>
        </div>
      </div>
    </div>
  );
}
