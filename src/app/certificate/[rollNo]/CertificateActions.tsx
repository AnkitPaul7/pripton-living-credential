"use client";

import { useState, useEffect } from "react";
import { Share2, Check } from "lucide-react";
import { Candidate } from "@/lib/mockData";

interface CertificateActionsProps {
  candidate: Candidate;
}

export function CertificateActions({ candidate: _candidate }: CertificateActionsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    // window.location is only available client-side, post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="no-print flex items-center gap-2.5 sm:gap-3">
      {/* Share Link Button */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-xl border border-slate-900/10 bg-slate-900/5 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-900/10 hover:text-slate-900 hover:border-slate-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 active:translate-y-0 dark:border-white/15 dark:bg-white/10 dark:text-slate-200 dark:shadow-black/20 dark:hover:bg-white/20 dark:hover:text-white dark:hover:border-white/30"
        aria-label="Copy certificate link"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            <span>Share Link</span>
          </>
        )}
      </button>
    </div>
  );
}

