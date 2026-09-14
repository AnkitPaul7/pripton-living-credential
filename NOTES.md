# Notes

## Most Interesting Decision Made

Deciding how to implement the "shifting data" on the back of the credential without triggering a React hydration mismatch error. I initially considered doing the math directly in the component, but since Next.js Server Components and hydration require exact matching, I decided to apply a noise factor (±10%) to the data exclusively in a `useEffect` after the component mounts on the client.

## Hardest Part

Nailing the 3D flip interaction while keeping it accessible and responsive. Applying `preserve-3d`, `backface-hidden`, and managing `rotateY` via Framer Motion was relatively straightforward, but ensuring the flip respected the user's `prefers-reduced-motion` settings required conditionally toggling between 3D rotations and a simple opacity fade. Testing this alongside keyboard accessibility (handling `Enter` or `Space` to flip) was challenging but rewarding.

## What I'd Do with Another Day

1. **Dynamic Open Graph Images:** Right now the OG tags point to a mocked `/api/og` endpoint. Given another day, I would build a real `next/og` endpoint that dynamically generates a PNG of the certificate's front face using HTML/CSS so shared links look incredible on LinkedIn and Twitter.
2. **A real `@media print` pass:** `.no-print` now hides the nav/action buttons and the flip control, but the aurora background and glass blur still print rather than a flattened, ink-friendly layout — I'd give the certificate a dedicated print stylesheet.
3. **QR code on the public view:** A small QR code linking back to the certificate URL would make the "post it, or hand someone your phone" use case (e.g. a physical resume, an interview) more concrete.
4. **Fix the flip/accordion click conflict properly tested on touch devices:** I fixed the bug where clicking a syllabus module also flipped the card (both listened on the same bubble path), but I only verified it via code review and desktop DevTools device emulation, not a real phone.

## Bugs Found & Fixed in This Pass

- **Syllabus click was flipping the card.** The whole certificate face has a click/keydown handler that flips it; the `<details>`/`<summary>` accordion sits inside that face without stopping propagation, so opening a module also fired the flip. Fixed by stopping propagation on the syllabus container for both `click` and `keydown`.
- **The claim page never checked for an already-claimed roll number.** Per the brief, visiting the claim flow for an already-claimed roll number should redirect or show an "already claimed" state; the original implementation only ever showed the generic "not found" / feedback form. Added a check (against both the mock `claimed` flag and `localStorage`) that fires as the roll number is typed, not just on submit.
- **No light mode.** The whole UI was dark-only. Added a `ThemeToggle` (persisted to `localStorage`, defaults to OS preference, no flash-of-wrong-theme on load) and light-mode treatments across every screen.
