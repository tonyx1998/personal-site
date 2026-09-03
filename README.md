# personal-site

The portfolio and résumé of **To Yin Yu**, live at [www.toyinyu.com](https://www.toyinyu.com).

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 plus CSS Modules. Newsreader and Public Sans through `next/font`. Hosted on Vercel.

## How the site is put together

- `src/lib/projects.data.json` is the single source of truth for every project. The homepage, the archive at `/projects`, each `/projects/<slug>` page, the sitemap, the JSON-LD, and the résumé PDF all read from it. Edit the JSON, then regenerate the résumé.
- `src/components/PortfolioHome.tsx` renders the homepage from the JSON: every `featured` project gets a full-width screenshot and its highlights, everything else goes in the list below. Screenshots live in `public/projects/` and are mapped by slug in `src/lib/project-visuals.ts`.
- `src/components/ProjectsAll.tsx` renders the archive: featured projects with thumbnails, the rest as compact rows. A project with `"hidden": true` is left out of the homepage, the archive, the sitemap, and the routes.
- `src/app/layout.tsx` ships the light theme and a small pre-hydration script that applies a saved choice from `localStorage.theme`, or else the system preference, before first paint. Every route is statically rendered.
- `scripts/build-resume.py` generates `public/resume.pdf` from the `resume` block of each project entry.
- `scripts/check-links.mjs` fetches every project URL and, when all pass, stamps the date into `LINKS_CHECKED_ON` in `src/lib/site.ts`. That date is what the site shows as "Live, checked …".

## Working on it

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # eslint
npm run format:check # prettier
npm run resume       # rebuild public/resume.pdf (needs: pip install reportlab pypdf)
npm run check-links  # verify every project URL and update the checked date
```

No environment variables are required.

## Deploying

Pushes to `master` deploy to production through the Vercel Git integration. Do not run `vercel --prod` by hand; it does not move the production alias.

## Layout

```
src/
├── app/
│   ├── layout.tsx              root layout, metadata, theme bootstrap
│   ├── page.tsx                homepage
│   ├── projects/page.tsx       archive
│   ├── projects/[slug]/        one page per project
│   ├── not-found.tsx           404
│   ├── providers.tsx           theme store (localStorage or system preference)
│   ├── sitemap.ts, robots.ts
│   └── icon, apple-icon, opengraph-image, twitter-image
├── components/
│   ├── Chrome.module.css       page shell, header, footer
│   ├── PortfolioChrome.tsx     header (with theme toggle) and footer
│   ├── PortfolioHome.tsx       homepage
│   └── ProjectsAll.tsx         archive
└── lib/
    ├── projects.data.json      project roster (source of truth)
    ├── projects.ts             types, slug helper, hidden filter
    ├── project-visuals.ts      screenshot paths and alt text
    ├── site.ts                 canonical URL
    └── structured-data.ts      JSON-LD builders
public/projects/                product screenshots (1280×720)
public/resume.pdf               generated résumé
scripts/build-resume.py         résumé generator
scripts/check-links.mjs         link check that stamps LINKS_CHECKED_ON
```

## License

All rights reserved. © To Yin Yu.
