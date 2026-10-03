# Achref Lajmi — Portfolio

A dark, cinematic single-page portfolio with scroll-driven motion, plus three long-form
write-ups at `/writing/:slug`.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run serve      # preview the production build
npm run typecheck
```

Node 20.19+ or 22.12+ (Vite 7). Netlify is pinned to Node 22 in `netlify.toml`.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · wouter · lucide-react

## How it's put together

| Path | What's there |
| --- | --- |
| `src/index.css` | Design tokens. Palette, fonts and radii all live here. |
| `src/pages/home.tsx` | Section order for the single page. |
| `src/components/sections/` | One file per section; content is a `const` array at the top of each. |
| `src/lib/posts.ts` | The three write-ups, as structured blocks. |
| `src/lib/use-section-in-view.ts` | Drives the pinned `01 / Section` readout. |
| `public/` | CVs, images, favicons, robots, sitemap — copied to `dist/` verbatim. |

### The two accents mean something

`--primary` (cyan `#5ed8f0`) marks the system running unattended. `--gate` (amber `#f5a524`)
marks the point where a human decides. They are used semantically — in the hero headline, the
SmartPilot loop, and the manifesto word highlighting — not as decoration. Keep that distinction
if you add sections.

### Editing content

Each section holds its own data array, so copy changes don't require touching layout:

- Roles → `EXPERIENCES` in `sections/experience.tsx`
- Skills → `EXPERTISE` in `sections/expertise.tsx`
- Projects → `PROJECTS` in `sections/projects.tsx`
- Degrees and certs → `EDUCATION` / `CERTS` in `sections/education.tsx`
- Posts → `POSTS` in `lib/posts.ts`

In `PROJECTS`, `featureGroups` splits a project across pinned scroll "pages" — `[2, 2, 2]` means
three screens of two bullets each. Raising a number puts more text in a fixed-height frame, so
check for overflow after changing it. A project with no `videoId` renders the locked panel
instead of a demo.

Adding or removing a section means updating both `sectionsData` in
`components/section-indicator.tsx` and the index passed to `useSectionInView(n)` in that
section — they have to agree for the readout to track correctly.

### Motion

Every scroll-linked component reads `useReducedMotion()` and collapses to a static layout, and
`index.css` cuts animation durations under `prefers-reduced-motion`. Preserve both when adding
animation.

## Deploying

Netlify builds `npm run build` and publishes `dist/`. The SPA redirect in `netlify.toml` is what
makes `/writing/:slug` resolve on a hard refresh — don't remove it.
