# AI Context Log

## 2026-07-14

- Project started as a new SMK Raja Shahriman digital portal.
- Approved a staff-first, public link hub for 9–15 external eSistem websites.
- Approved a cinematic 2.5D SMKRS robot hero using the official red, blue, yellow, and black crest palette.
- Approved a featured horizontal card rail plus searchable category directory.
- Approved local typed configuration for future system links; no database or admin panel in version one.
- Full design specification: `docs/superpowers/specs/2026-07-14-smkrs-digital-portal-design.md`.
- Bootstrapped a static React, TypeScript, and Vite application with Vitest and Testing Library.
- Foundation verification: 1 test passed, ESLint reported no errors, and the production build completed successfully.
- Task 3 preserved the official crest as a byte-identical public asset and added a typed `SystemCard` with safe external-link attributes, visible focus treatment, and reduced-motion behavior.
- Task 3 verification: the focused card test passed (1/1); the full suite passed (5/5), ESLint reported no errors, and the production build completed successfully.
- Task 4 generated the cinematic SMKRS robot with the built-in image tool using the crest only as a palette reference, then removed the flat chroma background into a validated RGBA asset at `public/mascot/smkrs-robot.png`.
- Added the session-only loader, accessible Malay hero, and reduced-motion-aware 2.5D robot scene with pointer parallax capped at 12 px.
- Task 4 verification: focused loader/hero tests passed (3/3), the full suite passed (8/8), ESLint reported no errors, and the production build completed successfully. Browser visual QA was unavailable because the Playwright CLI setup was aborted.
- Task 5 added the featured horizontal rail and complete eSistem directory without expanding the two-entry production configuration. The rail uses native overflow, scroll snap, focus/button activation, and a rail-rooted `IntersectionObserver`; the directory combines controlled Malay search and category filters with a live result count and resettable empty state.
- Task 5 verification: the required missing-component RED state was captured; focused discovery/App tests passed (7/7), the full suite passed (14/14), ESLint reported no errors, and the production build completed successfully.
- Task 5 review fix expanded the complete-directory fixture to 12 safe `example.com` links and corrected the tablet/mobile featured-card column to `minmax(0, 100%)`, preventing cards from exceeding the capped section width while retaining horizontal scroll snap.
- Review-fix verification: the new 12-card test passed immediately because rendering already supported arbitrary list sizes; focused directory/rail tests passed (6/6), the full suite passed (15/15), ESLint reported no errors, and the production build completed successfully.
- Task 6 added the final site footer with crest fallback, school identity, motto, the four supported categories, and a Malay notice that linked eSistem operate at their respective external destinations.
- Final responsive decisions: the hero stacks and the directory uses two columns at 768 px; the 390 px state uses a one-column directory, native horizontal swipe rail, minimum 44 px controls, and a lighter static mascot composition. Pointer translation is capped at 6 px for tablet-sized robot scenes and 12 px on desktop.
- Reduced-motion CSS removes smooth scrolling, loader/light-sweep animation, interactive transitions, and card transforms; the React composition also skips the loader and hero/mascot motion when `prefers-reduced-motion` is active.
- Missing crest and mascot images are hidden on load error; the footer retains a branded `SMKRS` fallback so a missing asset does not break the composition.
- Task 6 TDD evidence: `npm.cmd run test -- src/App.integration.test.tsx` first failed because the external-destination footer notice was absent, then passed (1/1) after the completed composition was added.
- Task 6 automated verification on 2026-07-14: `npm.cmd run test` passed 16/16 tests across 8 files; `npm.cmd run lint` completed with zero errors; `npm.cmd run build` completed with Vite 8.1.4 and generated `dist/`.
- Task 6 browser QA was not completed. The attempt to start the local Vite app for in-app-browser inspection was interrupted before a usable browser session or viewport evidence was obtained; no browser tooling was installed or retried. Desktop 1440×900, tablet 768×1024, mobile 390×844, keyboard, reduced-motion, rail interaction, missing-image, and 200% zoom checks therefore remain release-gate work.
- Task 6 review fix removed the mobile rail's horizontal-only `touch-action` so native horizontal swipe remains available without blocking vertical page panning, and now routes a mascot load failure through the loader's idempotent completion path immediately.
- Review-fix TDD captured both regressions before implementation; focused tests passed 3/3, the full suite passed 18/18 across 9 files, ESLint reported no errors, and the production build completed successfully with Vite 8.1.4.
- Browser fallback fix added an explicit `img[hidden] { display: none; }` cascade rule so failed mascot and crest assets remain hidden despite the global block-image reset. TDD captured the missing rule first; focused tests passed 2/2, the full suite passed 19/19 across 9 files, ESLint reported no errors, and the production build completed successfully with Vite 8.1.4.
