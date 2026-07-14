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
