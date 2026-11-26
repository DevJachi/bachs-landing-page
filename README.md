# Bachs landing page

Next.js 14 (App Router, TypeScript). The home page is landing page v3, ported 1:1 from the approved design artifact: every section has the same position and height as the artifact at 1440px and at phone width.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Layout

```
app/
  layout.tsx                metadata, viewport, the Google Fonts the page uses
  page.tsx                  renders <LandingV3 />
  globals.css               Tailwind entry, for new work
  styles/landing-v3.css     every style of the page, in the order the artifact applied them
components/
  landing-v3/LandingV3.tsx  the page markup plus its interactions script
lib/
  landing-v3/markup.ts      the page markup (static HTML)
  landing-v3/fonts.ts       Google Fonts stylesheet URLs
public/
  landing/landing-v3.js     the page interactions (nav, menus, hero, MCP tabs, rails, carousels, stats and the rest)
  landing/assets/           every image and font the page uses, as plain files
  images/                   favicon and older images
```

## Notes

- The styles and scripts were ported as they are so nothing shifts. The stylesheet is layered round by round, so a later rule often overrides an earlier one: search for the selector before changing it.
- The interactions run as one classic script, loaded with `next/script` after the page is interactive. Each original block is wrapped on its own so one failing does not stop the rest.
- Tailwind's preflight stays off. Keep `lib/` out of Tailwind's `content` so utility classes never collide with class names in the page markup.
- Links: see the CTA map for where each link goes and which destinations still need building.
