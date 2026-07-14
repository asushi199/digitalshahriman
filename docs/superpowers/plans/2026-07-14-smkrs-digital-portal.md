# SMKRS Digital Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, static SMK Raja Shahriman portal that presents a cinematic 2.5D robot hero and gives staff fast access to configured external eSistem links.

**Architecture:** A Vite React application renders all portal content from one typed `SystemEntry[]` configuration. Motion is isolated into the loader, hero scene, and featured rail so reduced-motion and mobile fallbacks remain straightforward. There is no backend; search and category filtering happen locally.

**Tech Stack:** React, TypeScript, Vite, Framer Motion, Lucide React, Vitest, Testing Library, ESLint, CSS.

## Global Constraints

- Public-facing copy is Malay.
- Use the official crest palette: red, blue, yellow, and black on a dark base.
- Use a 2.5D SMKRS robot, not a real-time 3D renderer.
- Keep every eSistem entry in one typed local configuration source.
- Version one has no database, authentication, admin panel, or API.
- Honour `prefers-reduced-motion`; all links remain usable without motion.
- Open external systems in a new tab with `rel="noreferrer noopener"`.
- Do not invent production links. The two user-supplied URLs are the initial real entries; tests use fixtures to prove the 9–15-card layout.
- Preserve the root `README.md`, `AGENTS.md`, `.gitignore`, and `AI_CONTEXT_LOG.md`.

---

## Planned File Structure

- `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `index.html`: build, test, and lint entry points.
- `src/main.tsx`, `src/App.tsx`: application bootstrap and page composition only.
- `src/styles.css`: design tokens, responsive layout, component states, and reduced-motion fallback.
- `src/types/system.ts`, `src/data/systems.ts`, `src/lib/systems.ts`: portal content contract, real entries, search/filter logic.
- `src/components/PortalLoader.tsx`: session-only intro.
- `src/components/HeroSection.tsx`, `src/components/RobotScene.tsx`: cinematic introduction and 2.5D pointer motion.
- `src/components/FeaturedRail.tsx`, `src/components/SystemCard.tsx`: featured horizontal navigation.
- `src/components/SystemDirectory.tsx`, `src/components/SiteFooter.tsx`: practical directory and closing identity.
- `src/test/setup.ts`, `src/**/*.test.tsx`: component and behaviour tests.
- `public/brand/smkrs-crest.jpg`, `public/mascot/smkrs-robot.png`: approved brand and generated mascot assets.

---

### Task 1: Bootstrap the Tested React Application

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `eslint.config.js`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm run dev`, `npm run test`, `npm run lint`, and `npm run build`.
- Produces: `App(): JSX.Element` as the page root used by all later tasks.

- [ ] **Step 1: Install the application and test dependencies**

Run:

```powershell
npm.cmd init -y
npm.cmd install react react-dom framer-motion lucide-react
npm.cmd install -D typescript vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals @types/react @types/react-dom
npm.cmd pkg set type=module "scripts.dev=vite" "scripts.build=tsc -b && vite build" "scripts.test=vitest run" "scripts.test:watch=vitest" "scripts.lint=eslint ."
```

Expected: `package.json` and `package-lock.json` exist and npm reports no install failure.

- [ ] **Step 2: Add the test harness and a failing shell test**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('introduces the SMKRS digital portal in Malay', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /SMK Raja Shahriman Digital/i })).toBeInTheDocument()
    expect(screen.getByText('Satu Pusat, Semua Sistem')).toBeInTheDocument()
  })
})
```

Create `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 3: Run the shell test and confirm the red state**

Run: `npm.cmd run test -- src/App.test.tsx`

Expected: FAIL because `src/App.tsx` does not yet render the approved heading and tagline.

- [ ] **Step 4: Implement the minimal application shell**

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main>
      <section aria-labelledby="portal-title">
        <p>Portal Rasmi SMKRS</p>
        <h1 id="portal-title">SMK Raja Shahriman Digital</h1>
        <p>Satu Pusat, Semua Sistem</p>
      </section>
    </main>
  )
}
```

Create `src/main.tsx` to render `<App />` inside `StrictMode`, and import `src/styles.css`. Add the normal Vite root element to `index.html`. Configure the TypeScript project references and flat ESLint configuration for browser TypeScript/React files.

- [ ] **Step 5: Verify and commit the foundation**

Run:

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Expected: one passing test, zero lint errors, and a generated `dist/` build.

Commit:

```powershell
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js src .gitignore
git commit -m "chore: bootstrap SMKRS portal app"
```

---

### Task 2: Define the eSistem Contract and Real Initial Content

**Files:**
- Create: `src/types/system.ts`
- Create: `src/data/systems.ts`
- Create: `src/lib/systems.ts`
- Test: `src/lib/systems.test.ts`

**Interfaces:**
- Produces: `SystemCategory`, `SystemFilterCategory`, `SystemEntry`, `systems`, `SYSTEM_CATEGORIES`, and `filterSystems(entries, query, category)`.
- Consumers later receive `SystemEntry` objects only; no component hard-codes system copy or URLs.

- [ ] **Step 1: Write failing search and category tests**

Create `src/lib/systems.test.ts` with a three-entry fixture and these assertions:

```ts
expect(filterSystems(fixture, 'makmal', 'Semua').map((item) => item.id)).toEqual(['tempahan-makmal'])
expect(filterSystems(fixture, '', 'Akademik').map((item) => item.id)).toEqual(['modul-digital'])
expect(filterSystems(fixture, 'tidak wujud', 'Semua')).toEqual([])
```

- [ ] **Step 2: Run the tests and confirm the red state**

Run: `npm.cmd run test -- src/lib/systems.test.ts`

Expected: FAIL because the type and filter modules do not exist.

- [ ] **Step 3: Implement the content model**

Create `src/types/system.ts`:

```ts
export type SystemCategory = 'Akademik' | 'Pengurusan' | 'Kemudahan' | 'Sokongan Digital'
export type SystemFilterCategory = SystemCategory | 'Semua'

export interface SystemEntry {
  id: string
  name: string
  description: string
  category: SystemCategory
  url: `https://${string}`
  icon: 'book-open' | 'calendar-days' | 'file-text' | 'life-buoy'
  accent: string
  featured: boolean
  order: number
}
```

Create `src/data/systems.ts` with exactly these real entries:

```ts
export const systems: SystemEntry[] = [
  {
    id: 'modul-digital',
    name: 'Modul Digital',
    description: 'Akses modul dan sumber pembelajaran digital.',
    category: 'Akademik',
    url: 'https://manjung-moduldigital.netlify.app/',
    icon: 'book-open',
    accent: '#ffd900',
    featured: true,
    order: 1,
  },
  {
    id: 'tempahan-makmal',
    name: 'Tempahan Makmal',
    description: 'Semak dan tempah kemudahan makmal sekolah.',
    category: 'Kemudahan',
    url: 'https://tempahan-makmal-smkrs.g-24205213.chatgpt.site/',
    icon: 'calendar-days',
    accent: '#1857d8',
    featured: true,
    order: 2,
  },
].sort((a, b) => a.order - b.order)
```

Create `src/lib/systems.ts`:

```ts
import type { SystemEntry, SystemFilterCategory } from '../types/system'

export const SYSTEM_CATEGORIES: SystemFilterCategory[] = [
  'Semua',
  'Akademik',
  'Pengurusan',
  'Kemudahan',
  'Sokongan Digital',
]

export function filterSystems(
  entries: SystemEntry[],
  query: string,
  category: SystemFilterCategory,
) {
  const normalized = query.trim().toLocaleLowerCase('ms-MY')

  return entries.filter((entry) => {
    const matchesCategory = category === 'Semua' || entry.category === category
    const searchable = `${entry.name} ${entry.description} ${entry.category}`.toLocaleLowerCase('ms-MY')
    return matchesCategory && (!normalized || searchable.includes(normalized))
  })
}
```

- [ ] **Step 4: Verify and commit the configuration layer**

Run: `npm.cmd run test -- src/lib/systems.test.ts`

Expected: all three filter tests PASS.

Commit:

```powershell
git add src/types/system.ts src/data/systems.ts src/lib/systems.ts src/lib/systems.test.ts
git commit -m "feat: add typed eSistem configuration"
```

---

### Task 3: Add the Official Brand Assets and Reusable System Card

**Files:**
- Create: `public/brand/smkrs-crest.jpg`
- Create: `src/components/SystemCard.tsx`
- Test: `src/components/SystemCard.test.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `SystemEntry`.
- Produces: `SystemCard({ system, active?, onActivate? })` with a safe external link and equivalent hover/focus styling.

- [ ] **Step 1: Preserve the official crest as a public asset**

Verify the source resolves inside the workspace, then copy it mechanically:

```powershell
Copy-Item -LiteralPath 'logo\464221870_8496007703841186_2485666108519241738_n.jpg' -Destination 'public\brand\smkrs-crest.jpg'
```

Expected: the destination file exists and remains visually identical to the supplied crest.

- [ ] **Step 2: Write a failing external-link test**

Create a `SystemCard` test that renders the `Modul Digital` fixture and asserts:

```tsx
const link = screen.getByRole('link', { name: /Buka Modul Digital/i })
expect(link).toHaveAttribute('href', 'https://manjung-moduldigital.netlify.app/')
expect(link).toHaveAttribute('target', '_blank')
expect(link.getAttribute('rel')).toContain('noopener')
expect(screen.getByText('Akademik')).toBeInTheDocument()
```

- [ ] **Step 3: Run the test and confirm the red state**

Run: `npm.cmd run test -- src/components/SystemCard.test.tsx`

Expected: FAIL because `SystemCard` does not exist.

- [ ] **Step 4: Implement the reusable card**

Map the four `icon` values to explicit Lucide components. Render the name, category, description, icon, and `Buka Sistem` cue inside one anchor. Apply `--card-accent` from `system.accent`, `data-active`, and `onFocus={onActivate}`; do not attach nested buttons inside the anchor.

- [ ] **Step 5: Add brand tokens and card states**

Define CSS variables including:

```css
:root {
  --ink: #07090d;
  --surface: #10151e;
  --surface-raised: #171e2a;
  --school-red: #e3262e;
  --school-blue: #1857d8;
  --school-yellow: #ffd900;
  --text: #f6f7f2;
  --muted: #aeb7c5;
  --focus: #ffe66d;
}
```

Add visible `:focus-visible`, active scale, hover border illumination, and a non-motion fallback.

- [ ] **Step 6: Verify and commit the card system**

Run: `npm.cmd run test -- src/components/SystemCard.test.tsx`

Expected: PASS for content and safe link attributes.

Commit:

```powershell
git add public/brand/smkrs-crest.jpg src/components/SystemCard.tsx src/components/SystemCard.test.tsx src/styles.css
git commit -m "feat: add branded eSistem cards"
```

---

### Task 4: Build the Cinematic 2.5D Robot Hero

**Files:**
- Create: `public/mascot/smkrs-robot.png`
- Create: `src/components/PortalLoader.tsx`
- Create: `src/components/RobotScene.tsx`
- Create: `src/components/HeroSection.tsx`
- Test: `src/components/PortalLoader.test.tsx`
- Test: `src/components/HeroSection.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `PortalLoader({ reducedMotion, onComplete })`.
- Produces: `RobotScene({ reducedMotion })` with decorative imagery hidden from assistive technology.
- Produces: `HeroSection({ reducedMotion })` with anchors `#featured-systems` and `#all-systems`.

- [ ] **Step 1: Generate the transparent robot artwork**

Use the image-generation skill with the supplied crest as visual colour reference and this production prompt:

```text
Create a full-body 2.5D cinematic digital mascot for SMK Raja Shahriman, front three-quarter view, friendly disciplined school technology assistant, matte black robot body, cobalt-blue and vivid-red armour accents, warm yellow energy lights, simplified SMKRS lettering on the chest, holding a slim digital tablet, premium product-render lighting, realistic but welcoming proportions, clean silhouette, transparent background, no school crest reproduction, no extra text, no watermark. Leave clear separation around the head, shoulders, arms, tablet, and feet for subtle parallax animation.
```

Inspect the result at full size. Accept only one character, readable silhouette, correct limb count, transparent background, and no invented words. Save the approved image as `public/mascot/smkrs-robot.png`.

- [ ] **Step 2: Write failing loader and hero semantics tests**

Test that reduced motion calls `onComplete` immediately and does not render the progress counter. Test that the normal loader reaches completion with fake timers and sets `sessionStorage['smkrs-loader-seen']` to `true`. Test that the hero exposes `Terokai eSistem`, `Lihat Semua`, and the motto `Pengetahuan Punca Kejayaan`.

- [ ] **Step 3: Run the hero tests and confirm the red state**

Run: `npm.cmd run test -- src/components/PortalLoader.test.tsx src/components/HeroSection.test.tsx`

Expected: FAIL because the hero components do not exist.

- [ ] **Step 4: Implement the session loader**

Use an integer progress state from 0 to 100 over 1,200 ms. Skip when reduced motion is true or the session key already exists. Always clear the timer on unmount and call `onComplete` exactly once.

- [ ] **Step 5: Implement the 2.5D scene and hero**

Use Framer Motion values for pointer-relative X/Y movement with a maximum translation of 12 px. Layer the robot, two CSS glow orbs, grid/noise decoration, and a foreground light sweep. Disable pointer updates when reduced motion is active. Keep the hero copy in normal document flow and use the approved Malay text and actions.

- [ ] **Step 6: Verify and commit the cinematic hero**

Run:

```powershell
npm.cmd run test -- src/components/PortalLoader.test.tsx src/components/HeroSection.test.tsx
npm.cmd run build
```

Expected: hero tests PASS and the production build includes the mascot asset without compilation errors.

Commit:

```powershell
git add public/mascot/smkrs-robot.png src/components/PortalLoader.tsx src/components/PortalLoader.test.tsx src/components/RobotScene.tsx src/components/HeroSection.tsx src/components/HeroSection.test.tsx src/App.tsx src/styles.css
git commit -m "feat: add cinematic SMKRS robot hero"
```

---

### Task 5: Add the Featured Rail and Searchable Complete Directory

**Files:**
- Create: `src/components/FeaturedRail.tsx`
- Create: `src/components/SystemDirectory.tsx`
- Test: `src/components/FeaturedRail.test.tsx`
- Test: `src/components/SystemDirectory.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `SystemEntry[]`, `SYSTEM_CATEGORIES`, and `filterSystems`.
- Produces: `FeaturedRail({ systems })` and `SystemDirectory({ systems })`.

- [ ] **Step 1: Write failing interaction tests**

For `FeaturedRail`, pass a 12-entry fixture and assert only entries with `featured: true` appear, the first featured card starts active, and focusing a later card changes its `data-active` state.

For `SystemDirectory`, assert that typing `makmal` leaves `Tempahan Makmal`, selecting `Akademik` leaves `Modul Digital`, and an unmatched query renders `Tiada eSistem ditemui` plus a `Tetapkan Semula` button.

- [ ] **Step 2: Run the tests and confirm the red state**

Run: `npm.cmd run test -- src/components/FeaturedRail.test.tsx src/components/SystemDirectory.test.tsx`

Expected: FAIL because both components do not exist.

- [ ] **Step 3: Implement the featured rail**

Render featured systems in order inside a labelled horizontal region with previous/next buttons. Use native overflow and CSS scroll snap. Track the active card on focus and after button-controlled scrolling; use an `IntersectionObserver` rooted on the rail when available, with the first card as the deterministic fallback.

- [ ] **Step 4: Implement the directory**

Use controlled search and category state. Render a labelled search field, `Semua` plus four category buttons, an `aria-live="polite"` result count, and the conventional card grid. Reset both controls from the empty state.

- [ ] **Step 5: Compose both sections in App**

Pass `systems` to both components. Use `id="featured-systems"` and `id="all-systems"` to satisfy the hero links. Add section headings `eSistem Pilihan` and `Semua eSistem`.

- [ ] **Step 6: Verify and commit portal navigation**

Run:

```powershell
npm.cmd run test
npm.cmd run lint
```

Expected: all unit and component tests PASS with zero lint errors.

Commit:

```powershell
git add src/components/FeaturedRail.tsx src/components/FeaturedRail.test.tsx src/components/SystemDirectory.tsx src/components/SystemDirectory.test.tsx src/App.tsx src/styles.css
git commit -m "feat: add eSistem discovery experience"
```

---

### Task 6: Finish the Footer, Responsive States, Documentation, and Production QA

**Files:**
- Create: `src/components/SiteFooter.tsx`
- Test: `src/App.integration.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `README.md`
- Modify: `AI_CONTEXT_LOG.md`

**Interfaces:**
- Produces: completed single-page portal with functional no-motion, keyboard, tablet, mobile, and desktop states.

- [ ] **Step 1: Write the failing integration test**

Render `App` with reduced motion mocked true and assert there is exactly one `main`, the hero heading, both system links, the search input, the four category filters, and footer text explaining that linked eSistem operate at their respective destinations.

- [ ] **Step 2: Run the integration test and confirm the red state**

Run: `npm.cmd run test -- src/App.integration.test.tsx`

Expected: FAIL because the footer and completed composition are not present.

- [ ] **Step 3: Implement the footer and responsive polish**

Add the crest, school name, motto, category list, and Malay external-destination notice. Finish CSS at these explicit review widths:

- 1440 × 900: split hero, full pointer parallax, multi-column directory.
- 768 × 1024: stacked hero, reduced translation, two-column directory.
- 390 × 844: static/light robot composition, swipe rail, one-column directory, 44 px minimum control height.

Add `@media (prefers-reduced-motion: reduce)` to remove smooth scrolling, loader animation, parallax transitions, card tilt, and long reveals.

- [ ] **Step 4: Update operator documentation**

Document the exact commands (`npm install`, `npm run dev`, `npm run test`, `npm run lint`, `npm run build`), the `src/data/systems.ts` editing contract, supported icon keys/categories, and static deployment directory `dist/`. Record implementation decisions and verification results in `AI_CONTEXT_LOG.md`.

- [ ] **Step 5: Run the full automated verification**

Run:

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Expected: all tests PASS, zero lint errors, and Vite completes a production build in `dist/`.

- [ ] **Step 6: Perform browser QA**

Start `npm.cmd run dev -- --host 127.0.0.1`, then inspect the three explicit viewport sizes. Verify loader session behaviour, reduced-motion mode, keyboard focus order, swipe/scroll rail, search, each category, empty state, both external URLs, missing-image fallback, and that no text overlaps at 200% zoom.

- [ ] **Step 7: Commit the finished portal**

```powershell
git add src README.md AI_CONTEXT_LOG.md
git commit -m "feat: complete responsive SMKRS digital portal"
```

Expected: `git status --short` shows only the user's original untracked reference video and source-logo folder unless they are deliberately added later.

---

## Release Acceptance

- The two confirmed real systems work, and adding up to 15 entries requires only `src/data/systems.ts` edits.
- The robot and hero deliver the approved cinematic identity without WebGL or a real-time 3D model.
- Search, filtering, keyboard access, mobile use, and reduced motion work independently of decorative animation.
- Automated tests, lint, and the production build all pass.
- No user-supplied reference video is committed.
