"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, Clock3, ArrowLeft, ArrowRight } from "lucide-react";
import { Candidate } from "@/lib/mockData";
import { Certificate } from "@/components/Certificate";
import { AuroraBlobs } from "@/components/AuroraBlobs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CertificateActions } from "./CertificateActions";

interface CertificateGateProps {
  candidate: Candidate | null;
  rollNo: string;
}

function StateShell({
  icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-8 bg-slate-50 dark:bg-[#0a0b16]">
      <AuroraBlobs side="front" />

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <div className="relative rounded-2xl border border-slate-900/10 bg-white/70 p-8 text-center shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-10 dark:border-white/15 dark:bg-white/5 dark:shadow-black/50">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-slate-900/10 bg-slate-900/5 text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
            {icon}
          </div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-indigo-600 dark:text-indigo-300 uppercase">
            {eyebrow}
          </p>
          <h1 className="mb-3 font-serif text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="mb-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
          {children ?? (
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-900/10 bg-slate-900/5 px-4 py-2.5 font-medium text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-900/10 active:translate-y-0 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          )}
        </div>
      </motion.div>
    </main>
  );
}

export function CertificateGate({ candidate, rollNo }: CertificateGateProps) {
  const [claimed, setClaimed] = useState(candidate?.claimed ?? false);

  useEffect(() => {
    if (!candidate) return;
    // localStorage is only readable client-side, post-mount.
    const claimedState = localStorage.getItem(`claimed_${rollNo}`);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (claimedState === "true") setClaimed(true);
  }, [candidate, rollNo]);

  // Not found: rollNo doesn't exist in the record at all.
  if (!candidate) {
    return (
      <StateShell
        icon={<FileQuestion className="w-7 h-7" />}
        eyebrow="Error 404"
        title="Certificate Not Found"
        description={`We couldn't find a record for roll number "${rollNo}". Double-check the link or roll number and try again.`}
      />
    );
  }

  // Found, but not yet claimed — distinct from "not found".
  if (!claimed) {
    return (
      <StateShell
        icon={<Clock3 className="w-7 h-7" />}
        eyebrow="Not Yet Claimed"
        title="This Credential Is Waiting"
        description={`${candidate.name}'s certificate exists but hasn't been claimed yet. Claim it to unlock the public, shareable version.`}
      >
        <Link
          href="/"
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 active:translate-y-0 shadow-lg shadow-indigo-500/25"
        >
          Claim It Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </StateShell>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12 bg-slate-50 dark:bg-[#0a0b16]">
      {/* Full-viewport background — the card's own AuroraBlobs is scoped to
          the (narrower, centered) card wrapper below, so without this the
          aurora only ever covered the middle of the page on wide screens. */}
      <AuroraBlobs side="front" className="fixed inset-0" />

      {/* Unified container for both nav bar and certificate card */}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 sm:gap-8 pb-12 sm:pb-16 z-10">
        {/* Navigation & Action Toolbar */}
        <div className="no-print flex w-full items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-900/10 bg-slate-900/5 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-700 shadow-lg shadow-black/5 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:bg-slate-900/10 hover:text-slate-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:shadow-black/20 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <CertificateActions candidate={candidate} />
            <ThemeToggle />
          </div>
        </div>

        {/* Certificate Card Section */}
        <div className="w-full">
          <Certificate candidate={candidate} />
        </div>
      </div>
    </main>
  );
}
