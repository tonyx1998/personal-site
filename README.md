# personal-site

[![Live](https://img.shields.io/badge/live-toyinyu.com-6366f1?style=flat-square)](https://www.toyinyu.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

The personal portfolio of **To Yin Yu** — a full-stack software engineer focused on applied AI. A single-page Next.js site with a hero spotlight, a bento-grid project showcase with cursor-tracked spotlight cards, server-rendered dark/light theming, and a serverless contact form.

**Live:** [www.toyinyu.com](https://www.toyinyu.com)

---

## Features

- **Server-rendered theming** — dark/light mode resolved from a cookie in the root layout, so there's no flash of unstyled content and no theme `<script>` tag.
- **Bento-grid project gallery** — asymmetric featured/standard cards with a cursor-tracking radial-gradient spotlight on hover.
- **Motion** — entrance and scroll-triggered animations via Framer Motion, with full `prefers-reduced-motion` fallbacks.
- **Serverless contact form** — posts to Web3Forms with an `AbortController` timeout; no backend to run.
- **SEO-ready** — Metadata API, dynamic Open Graph / Twitter images, JSON-LD structured data, and generated `sitemap.xml` / `robots.txt`.
- **Generated résumé** — an ATS-friendly PDF built from a single Python source of truth.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 (class-based dark mode) |
| Animation | Framer Motion |
| Icons | lucide-react + hand-rolled SVGs |
| Forms | Web3Forms (no server) |
| Hosting | Vercel |

A deeper, teaching-oriented tour of every library and pattern lives in **[docs/STACK.md](docs/STACK.md)**.

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone https://github.com/tonyx1998/personal-site.git
cd personal-site
npm install
cp .env.example .env.local   # add your Web3Forms key
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Yes | Access key from [web3forms.com](https://web3forms.com), used by the contact form. Without it, submissions report an error. |

See [`.env.example`](.env.example).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `python3 scripts/build-resume.py public/resume.pdf` | Regenerate the résumé PDF (`pip install reportlab pypdf`) |

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # root layout, metadata, cookie-based theming
│   ├── page.tsx              # home page — composes all sections
│   ├── projects/page.tsx     # full project listing
│   ├── providers.tsx         # in-house theme context (no next-themes)
│   ├── globals.css           # Tailwind v4 tokens + a11y rules
│   ├── sitemap.ts / robots.ts
│   └── icon / apple-icon / opengraph-image / twitter-image   # generated assets
├── components/               # Hero, About, Skills, Projects, Experience, Contact, …
└── lib/
    ├── projects.ts           # project data (single source of truth)
    ├── site.ts               # SITE_URL — used by metadata, sitemap, robots
    ├── structured-data.ts    # JSON-LD
    └── utils.ts              # cn() helper
public/                       # resume.pdf + static assets
scripts/build-resume.py       # ATS-friendly résumé PDF generator
docs/STACK.md                 # stack & skills walkthrough
```

## Architecture notes

- **Cookie-based theming.** The root layout reads a `theme` cookie and sets `class="dark"` on `<html>` server-side — no FOUC, no hydration-warning `<script>`. `src/lib/site.ts` is the single source of truth for the canonical URL used by `metadataBase`, the sitemap, and robots.
- **Client-only contact form.** `ContactForm` is loaded with `ssr: false` so browser extensions that mutate form inputs before hydration can't trigger mismatches — the SSR HTML ships zero inputs.
- **Data-driven projects.** Everything in the gallery comes from `src/lib/projects.ts`; cards link to a live URL when one is public and show a "private repo" badge otherwise.

## Deployment

Hosted on Vercel; pushes to `master` deploy to production. Manual deploy:

```bash
vercel --prod
```

## License

All rights reserved. © To Yin Yu.
