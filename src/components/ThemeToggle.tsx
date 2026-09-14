"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Reads localStorage/matchMedia, which aren't available at server-render
    // time — this sync-up can only happen post-mount, on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getStoredTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("theme", next);
  };

  // Avoid a mismatched icon flash before we know the real theme.
  if (!mounted) {
    return (
      <button
        aria-hidden
        tabIndex={-1}
        className={`h-9 w-9 rounded-full border border-slate-900/10 bg-slate-900/5 dark:border-white/15 dark:bg-white/10 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-900/10 bg-slate-900/5 text-slate-600 shadow-sm backdrop-blur-xl transition-colors duration-200 hover:bg-slate-900/10 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 dark:border-white/15 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20 dark:hover:text-white ${className}`}
    >
      <motion.span
        key={theme}
        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center"
      >
        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </motion.span>
    </button>
  );
}
