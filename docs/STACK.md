# Stack

What the site is built with and why each piece is there. Kept short on purpose; the code is small enough to read directly.

## Framework and rendering

**Next.js 16, App Router.** Every route is a Server Component except the small client pieces that need state: the theme store in `src/app/providers.tsx`, the project reel and the mobile menu.

**Static rendering.** Nothing on the site reads request data, so every page can be prerendered at build time and served from the Vercel CDN. The project pages use `generateStaticParams` over the JSON roster. Do not add `cookies()` or `headers()` to the root layout; that would turn every route dynamic again.

**Theme without a flash.** `layout.tsx` renders `<html class="dark">` and a `beforeInteractive` script reads `localStorage.theme` before first paint. `providers.tsx` exposes the same value to React through `useSyncExternalStore`.

## Data

**`src/lib/projects.data.json`** holds every project: title, description, year, tags, links, highlights, and an optional `resume` block. `projects.ts` types it, derives the URL slug from the title, and filters out `hidden` entries. The sitemap, JSON-LD, archive, and project pages all import from there.

**`scripts/build-resume.py`** turns the `resume` blocks into `public/resume.pdf` with reportlab. Run `npm run resume` after editing the JSON.

## Styling and motion

**Tailwind CSS v4** for utilities, with CSS Modules (`PortfolioHome.module.css`, `ProjectsAll.module.css`, `ProjectDetail.module.css`) for the page layouts. Design tokens live in `globals.css`.

**Framer Motion** is used only in `PortfolioHome.tsx`, for the project reel crossfade and the row reveal. Every animation checks `useReducedMotion` and `globals.css` zeroes animation durations under `prefers-reduced-motion: reduce`.

**Geist and Geist Mono** are loaded through `next/font`.

## SEO

Metadata API for titles and descriptions, file-convention `opengraph-image.tsx` and `twitter-image.tsx` for share cards, `sitemap.ts` and `robots.ts` generated from the roster, and JSON-LD (`Person`, `WebSite`, `CollectionPage`, `CreativeWork`, `BreadcrumbList`) from `structured-data.ts`.

## Tooling

ESLint (`eslint-config-next`), Prettier, TypeScript strict, React Compiler enabled in `next.config.ts`. Vercel Web Analytics is included through `@vercel/analytics`.
