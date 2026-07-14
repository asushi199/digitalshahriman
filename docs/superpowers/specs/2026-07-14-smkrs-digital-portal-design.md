# SMK Raja Shahriman Digital Portal — Design Specification

## Purpose

Build a public, mobile-friendly digital portal for SMK Raja Shahriman that gives staff one memorable place to access 9–15 existing eSistem websites. The portal does not replace those systems, authenticate users, or copy their data; each card opens the original external website.

Primary audience: school staff. Secondary audiences may use public links, but staff speed and clarity take priority.

## Experience Direction

The approved direction is a cinematic mascot portal inspired by the motion-rich portfolio reference while remaining practical for daily school use.

- Brand foundation: the official crest's red, blue, yellow, and black.
- Hero character: a custom SMKRS digital robot with a dark body, red/blue armour accents, yellow energy light, and a simplified `SMKRS` chest mark.
- Main identity: `SMK Raja Shahriman Digital`.
- Primary line: `Satu Pusat, Semua Sistem`.
- Supporting motto: `Pengetahuan Punca Kejayaan`.
- Visual tone: cinematic, futuristic, disciplined, and recognisably school-owned rather than a generic technology template.

## Page Structure

### 1. First-load sequence

- Show a short numeric loading sequence and SMKRS light mark only on the first visit in a session.
- Complete within roughly 1.5 seconds when assets are cached; never block indefinitely.
- Skip immediately for reduced-motion users or when critical artwork fails to load.

### 2. Cinematic hero

- Full-viewport dark scene with the robot positioned centre-right and the main copy on the left.
- Layered 2.5D artwork provides depth without a real-time 3D model.
- Primary actions: `Terokai eSistem` scrolls to the featured rail; `Lihat Semua` scrolls to the directory.
- Keep the school crest visible but separate from the robot; use a simplified SMKRS mark on the character.

### 3. Featured eSistem rail

- Display selected systems as a horizontal, touch-friendly card rail.
- The card nearest the centre receives a modest scale and lighting emphasis.
- Hover/focus reveals the description, category, external-link cue, and `Buka Sistem` action.
- Clicking the card opens its configured external URL in a new tab with safe link attributes.

### 4. Complete directory

- Provide a conventional grid below the cinematic rail so daily use never depends on animation.
- Include text search and category filters: `Akademik`, `Pengurusan`, `Kemudahan`, and `Sokongan Digital`.
- Empty search results show a clear Malay message and a reset action.

### 5. Footer

- Repeat the school identity, motto, and a compact list of portal categories.
- State that each eSistem is operated at its linked destination.

## Motion and Interaction

- Robot idle state: subtle breathing light and small posture drift.
- Pointer movement: low-amplitude parallax and eye/head tracking within safe bounds.
- Scroll: staged text reveals, gentle section depth changes, and card-rail movement.
- Cards: restrained tilt, border illumination, and image zoom on hover; keyboard focus receives an equivalent visible state.
- Avoid continuous high-speed movement, aggressive cursor replacement, and scroll hijacking.
- Honour `prefers-reduced-motion` by removing the loader, parallax, tilt, and large transitions while preserving all content and controls.

## Content Model

All portal entries live in one typed local configuration file. Each entry contains:

- stable `id`
- Malay `name`
- short `description`
- `category`
- absolute `url`
- icon or artwork reference
- card accent colour
- `featured` flag and optional display order

The first confirmed entries are `Modul Digital` and `Tempahan Makmal`. Remaining links will be added through the same configuration without changing layout code.

## Responsive and Accessibility Behaviour

- Desktop: split hero composition, horizontal featured rail, multi-column directory.
- Tablet: reduced parallax, balanced hero stack, two-column directory.
- Mobile: static or lightly animated robot composition, swipeable rail, single-column directory, no pointer-only interactions.
- Use semantic landmarks, keyboard-operable controls, visible focus states, descriptive link labels, and sufficient contrast.
- Provide alternative text for meaningful artwork and mark decorative layers as hidden from assistive technology.

## Performance and Failure Handling

- Use responsive AVIF/WebP artwork and lazy-load non-critical layers.
- Keep the hero functional if the robot image, decorative layer, or motion script fails.
- Use CSS transforms and opacity for routine animation; do not use a continuous heavy 3D renderer.
- External links remain usable even when animations are disabled.
- Validate configured URLs during development and show no broken image placeholders.

## Technical Shape

- Static React + TypeScript frontend built with Vite.
- No database, authentication, admin panel, or API in the first version.
- Motion is divided into small components: first-load sequence, hero parallax, featured rail, and reveal effects.
- Deployment output is a static site suitable for Netlify or Vercel; the final host can be selected at release time without changing the UI architecture.

## Acceptance Criteria

- Staff can reach any configured eSistem from the complete directory in no more than one search/filter interaction and one click.
- The portal visibly uses the official crest palette and approved Malay identity text.
- The SMKRS robot appears as the principal hero visual with 2.5D interaction on capable desktop devices.
- All 9–15 configured systems render from a single configuration source.
- The full experience works at mobile and desktop widths, with keyboard navigation and reduced-motion mode.
- A missing decorative asset or disabled animation does not prevent navigation to any system.

## Approved Constraints

- Staff-first public portal.
- Link hub only; existing systems remain external.
- 9–15 systems in version one.
- Cinematic mascot portal direction.
- 2.5D mascot animation, not a real-time 3D model.
- School brand colours on a dark base.
- Local configuration file for content maintenance.

