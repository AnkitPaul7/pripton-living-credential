# The Living Credential

An interactive, shareable digital certificate for an exam platform built with Next.js (App Router), Tailwind CSS, and Framer Motion.

## Concept

A digital certificate that isn't static. It has two sides connected by a 3D flip interaction:

- **Front:** Showcases the candidate's achievement (animated score count-up, pass/fail status, staggered syllabus reveal).
- **Back:** Shows the continuous learning journey post-exam with a simulated live animated chart and a streak counter.

The entire experience is wrapped in a premium, responsive glassmorphism UI with delightful micro-interactions like confetti on claim, and it fully supports both **light and dark mode** (a toggle in the top-right corner, defaulting to the visitor's OS preference and persisted to `localStorage`).

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Interpretation & Tradeoffs

- **Backend:** Per the project requirements, there is no backend. The `claimed` state is mocked using `localStorage` on the claim page (`/`).
- **Public Shareability:** Since we use `localStorage`, when a user shares their certificate link with someone else, the viewer's browser won't have the `localStorage` flag. As a tradeoff to ensure public accessibility, the public route (`/certificate/[rollNo]`) bypasses the `localStorage` check and renders the certificate as long as the candidate exists in our mock data.
- **Dynamic Visualization:** The back of the certificate randomly shifts the `minutesActive` values by ±10% _after_ hydration on the client side. This satisfies the requirement of simulating live activity without causing hydration mismatches in Next.js.
- **Syllabus Accordion:** Uses native HTML5 `<details>` and `<summary>` elements for semantic, accessible disclosures, animated smoothly with `framer-motion`. The accordion stops click/keydown propagation so expanding a module never also triggers the card's flip — the two interactions live in the same click target but shouldn't fire together.
- **Micro-interactions:** Extensively used `framer-motion` for animated score count-ups, staggered reveals, and `react-confetti` to reward the user upon claiming the credential. All heavy animations automatically respect `prefers-reduced-motion` settings.
- **Already-Claimed Detection:** The claim page checks the roll number against both the mock "claimed" flag and `localStorage` as soon as it's typed (not just on submit) — entering an already-claimed roll number swaps the feedback field for a direct link to the public certificate instead of asking for feedback again.
- **Dark / Light Mode:** Implemented with a `.dark` class on `<html>`, toggled by `ThemeToggle` and initialized by a pre-hydration inline script (so there's no flash of the wrong theme). Every surface — claim form, certificate front/back, not-found/not-claimed states — has a light and dark treatment.
- **Naming:** The assignment brief names a specific company; this build uses a placeholder ("Northlight Academy") wherever a certificate issuer name is shown, since the actual employer name shouldn't be hardcoded into a public, shareable artifact for an assignment submission.
