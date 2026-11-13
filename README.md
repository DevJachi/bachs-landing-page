# Bachs landing page

Next.js 14 (App Router, TypeScript) + Tailwind CSS. It is a static page and renders identically to the approved design artifact: every section's height matches pixel for pixel at 1440px.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Layout

```
app/
  layout.tsx            metadata, viewport, dark-by-default theme script (runs before paint)
  page.tsx              section order
  globals.css           Tailwind entry (loaded last)
  styles/
    base.css            original bachs.io stylesheet (fonts from /public/fonts)
    astro-scoped.css    component styles the original Astro build inlined
    site.css            the redesign: sections, dark mode, tablet and phone rules
components/
  sections/*.tsx        one component per section, in page order
  SiteScripts.tsx       client component that starts all interactions once
lib/
  interactions.ts       nav, theme toggle, showcase tabs, logo marquee, Gap scroll effect,
                        bento visuals, platform scenes, SDK tabs, testimonials, FAQ, globe, world map
  landmask.json         world land data for the ASCII globe and the dotted map (Natural Earth 110m)
public/
  images/  fonts/       all assets as plain files
types/css.d.ts          lets inline styles use CSS custom properties
```

## Styling

- The section styles were ported as-is so the page matches the approved design exactly. They live in `app/styles/*.css`.
- Tailwind is set up with the design tokens in `tailwind.config.ts` (brand blue, ink, card surfaces, mint, Geist fonts, `max-w-rail`). Use utilities for new work; `darkMode` follows the `.theme-dark` class that the toggle sets.
- Tailwind's preflight is off because the original stylesheet already resets the page; turning it on would shift spacing.
- A sensible next step is to move one section at a time from `site.css` into Tailwind classes on its component.

## Before launch

- **Testimonials** (`Testimonials.tsx`) use placeholder names, quotes and Unsplash stand-in photos. Replace them with real customers and photos you have rights to.
- Scene data in `Platform.tsx` (names, emails, amounts) is sample data.
- Links point at the live bachs.io, docs and app URLs.
