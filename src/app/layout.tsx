import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

// Inter (sans) ships variable weights already; Fraunces (serif) is a true
// variable font too — both axes respond to weight/size instead of the app
// shipping separate static cuts per heading size.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "The Living Credential",
  description: "A digital certificate that reflects continuous learning.",
};

// Runs before hydration so the correct theme class is on <html> for the
// very first paint — otherwise a dark-mode visitor sees a light flash.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className="min-h-full flex flex-col relative bg-slate-50 text-slate-900 dark:bg-[#0a0b16] dark:text-slate-100"
        suppressHydrationWarning
      >
        {/* App-wide grain accent — a thin blended texture layer, not a
            standalone background, so every screen picks it up automatically. */}
        <div
          aria-hidden
          className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.02] dark:opacity-[0.035] mix-blend-overlay"
        />
        {children}
      </body>
    </html>
  );
}
