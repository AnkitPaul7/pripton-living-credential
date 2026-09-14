"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MOCK_CANDIDATES } from "@/lib/mockData";
import { AuroraBlobs } from "@/components/AuroraBlobs";
import { ThemeToggle } from "@/components/ThemeToggle";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const MIN_FEEDBACK_LENGTH = 20;

function isAlreadyClaimed(rollNo: string): boolean {
  const candidate = MOCK_CANDIDATES.find((c) => c.rollNo === rollNo);
  if (!candidate) return false;
  if (candidate.claimed) return true;
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(`claimed_${rollNo}`) === "true";
}

export default function ClaimPage() {
  const router = useRouter();
  const [rollNo, setRollNo] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success" | "already-claimed">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const { width, height } = useWindowSize();

  const feedbackValid = feedback.trim().length >= MIN_FEEDBACK_LENGTH;
  const canSubmit = rollNo.trim().length > 0 && feedbackValid && status !== "loading";

  // A roll number that's already claimed doesn't need feedback re-entered —
  // surface that as soon as we know, instead of only on submit.
  useEffect(() => {
    // Reads localStorage (an external system, not React state), so this
    // can't be computed during render — it must run as a synchronization
    // effect keyed off the roll number the user is typing.
    /* eslint-disable react-hooks/set-state-in-effect */
    const trimmed = rollNo.trim();
    if (!trimmed) {
      if (status === "already-claimed") setStatus("idle");
      return;
    }
    if (isAlreadyClaimed(trimmed)) {
      setStatus("already-claimed");
    } else if (status === "already-claimed") {
      setStatus("idle");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollNo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setErrorMsg("");

    // Simulate a network round-trip so the loading state is actually visible.
    await new Promise((r) => setTimeout(r, 600));

    const trimmedRoll = rollNo.trim();
    const candidate = MOCK_CANDIDATES.find((c) => c.rollNo === trimmedRoll);

    if (!candidate) {
      setStatus("error");
      setErrorMsg("Roll number not found. Double-check and try again.");
      return;
    }

    if (isAlreadyClaimed(trimmedRoll)) {
      setStatus("already-claimed");
      return;
    }

    // Persist claim status and feedback
    localStorage.setItem(`claimed_${candidate.rollNo}`, "true");
    localStorage.setItem(`feedback_${candidate.rollNo}`, feedback.trim());

    setStatus("success");

    // Redirect to /certificate/[rollNo] after a short beat so celebration is seen
    setTimeout(() => {
      router.push(`/certificate/${candidate.rollNo}`);
    }, 1400);
  }

  const formLocked = status === "loading" || status === "success" || status === "already-claimed";

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0b16] px-4 py-12 relative overflow-hidden">
      {/* Dynamic Aurora & Grain Background with pulse on success */}
      <AuroraBlobs side="front" pulse={status === "success"} />

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      {/* Confetti celebration on success */}
      {status === "success" && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
        />
      )}

      {/* Ambient glow behind the card */}
      <div className="relative w-full max-w-md z-10">
        <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="relative rounded-2xl border border-slate-900/10 bg-white/70 backdrop-blur-xl shadow-2xl shadow-black/10 p-8 dark:border-white/10 dark:bg-white/5 dark:shadow-black/40">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-700 dark:border-white/15 dark:bg-white/5 dark:text-indigo-200">
              ✦ CLAIM YOUR LEGACY
            </span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-center text-slate-900 dark:text-white mb-2">
            The Living Credential
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-8">
            Verify your achievement and unlock a credential that grows with you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="rollNo"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Roll Number
              </label>
              <input
                id="rollNo"
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                disabled={status === "loading" || status === "success"}
                placeholder="e.g., 1001"
                autoComplete="off"
                className="w-full rounded-lg border border-slate-900/10 bg-slate-900/[0.03] px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/30 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <AnimatePresence mode="wait">
              {status === "already-claimed" ? (
                <motion.div
                  key="already-claimed"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="status"
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200"
                >
                  <p className="font-medium">This certificate has already been claimed.</p>
                  <Link
                    href={`/certificate/${rollNo.trim()}`}
                    className="mt-2 inline-flex items-center gap-1.5 font-semibold text-amber-900 underline decoration-amber-500/50 underline-offset-2 hover:text-amber-950 dark:text-amber-100 dark:hover:text-white"
                  >
                    View the public certificate
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="feedback-field"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <label
                      htmlFor="feedback"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Exam Experience Feedback
                    </label>
                    <span
                      className={`text-xs tabular-nums ${
                        feedbackValid
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-500"
                      }`}
                    >
                      {feedback.length}/{MIN_FEEDBACK_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={formLocked}
                    placeholder="How was it? (min 20 chars)"
                    rows={4}
                    className="w-full rounded-lg border border-slate-900/10 bg-slate-900/[0.03] px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition resize-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/30 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-rose-600 dark:text-rose-400"
                  role="alert"
                >
                  {errorMsg}
                </motion.p>
              )}
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-emerald-600 dark:text-emerald-400 font-medium"
                  role="status"
                >
                  Certificate claimed! Redirecting…
                </motion.p>
              )}
            </AnimatePresence>

            {status === "already-claimed" ? (
              <Link
                href={`/certificate/${rollNo.trim()}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                View Certificate
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-900/10 disabled:text-slate-500 shadow-lg shadow-indigo-500/25 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:disabled:bg-white/10"
              >
                {status === "loading" ? "Verifying…" : "Claim Credential"}
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
