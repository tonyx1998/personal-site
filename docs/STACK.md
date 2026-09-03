# Stack

What the site is built with and why each piece is there. Kept short on purpose; the code is small enough to read directly.

## Framework and rendering

**Next.js 16, App Router.** Every route is a Server Component except the small client pieces that need state: the theme store in `src/app/providers.tsx` and the header with its mobile menu and theme toggle.

**Static rendering.** Nothing on the site reads request data, so every page can be prerendered at build time and served from the Vercel CDN. The project pages use `generateStaticParams` over the JSON roster. Do not add `cookies()` or `headers()` to the root layout; that would turn every route dynamic again.

**Theme without a flash.** Light is the default. A `beforeInteractive` script in `layout.tsx` applies a saved choice from `localStorage.theme`, or else `prefers-color-scheme`, before first paint. `providers.tsx` exposes the same value to React through `useSyncExternalStore` and listens for system changes.

## Data

**`src/lib/projects.data.json`** holds every project: title, description, year, tags, links, highlights, and an optional `resume` block. `projects.ts` types it, derives the URL slug from the title, and filters out `hidden` entries. The sitemap, JSON-LD, archive, and project pages all import from there.

**`scripts/build-resume.py`** turns the `resume` blocks into `public/resume.pdf` with reportlab. Run `npm run resume` after editing the JSON.

## Styling and motion

**Tailwind CSS v4** for the few body utilities, with CSS Modules (`Chrome.module.css`, `PortfolioHome.module.css`, `ProjectsAll.module.css`, `ProjectDetail.module.css`, `not-found.module.css`) for the layouts. Design tokens (ground, frame, ink, line, accent) live in `globals.css` with a `.dark` override set.

**No animation library.** The only motion is a hover reveal on screenshot links. Everything is visible at rest, so the page reads the same with JavaScript off. `globals.css` zeroes transitions under `prefers-reduced-motion: reduce`.

**Newsreader** (headings, variable weight with optical sizing) and **Public Sans** (text) are loaded through `next/font`.

## SEO

Metadata API for titles and descriptions, file-convention `opengraph-image.tsx` and `twitter-image.tsx` for share cards, `sitemap.ts` and `robots.ts` generated from the roster, and JSON-LD (`Person`, `WebSite`, `CollectionPage`, `CreativeWork`, `BreadcrumbList`) from `structured-data.ts`.

## Tooling

ESLint (`eslint-config-next`), Prettier, TypeScript strict, React Compiler enabled in `next.config.ts`. Vercel Web Analytics is included through `@vercel/analytics`.
