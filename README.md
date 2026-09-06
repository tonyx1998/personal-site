# personal-site

The portfolio and résumé of **To Yin Yu**, live at [www.toyinyu.com](https://www.toyinyu.com).

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 plus CSS Modules. Newsreader and Public Sans through `next/font`. Hosted on Vercel.

## How the site is put together

- `src/lib/projects.data.json` is the single source of truth for every project. The homepage, the archive at `/projects`, each `/projects/<slug>` page, the sitemap, the JSON-LD, and the résumé PDF all read from it. Edit the JSON, then regenerate the résumé.
- `src/components/PortfolioHome.tsx` renders three `featured` projects as image-and-text rows and four `homepageCompact` projects as smaller entries. The archive still includes every visible record. `homepageSummary` and `contribution` keep the homepage concise; `caseStudy` contains the longer explanation and evidence.
- `src/components/ProjectsAll.tsx` renders the archive: featured projects with thumbnails, the rest as compact rows. A project with `"hidden": true` is left out of the homepage, the archive, the sitemap, and the routes.
- `src/app/layout.tsx` ships the light theme and a small pre-hydration script that applies a saved choice from `localStorage.theme`, or else the system preference, before first paint. Every route is statically rendered.
- `scripts/build-resume.py` generates the one-page `public/resume.pdf` from explicit project profiles and the shared `resume` fields. It validates the staged document before replacing the previous PDF. See [resume tailoring](docs/resume-tailoring.md).
- `scripts/check-links.mjs` fetches every project URL and, when all pass, stamps the maintenance date into `LINKS_CHECKED_ON` in `src/lib/site.ts`. The interface uses direct product links instead of repeating that historical check date.
- `public/projects/evidence/` contains six labeled product demonstrations and public captures. The 1280-pixel images serve as covers; the 2× originals are used for case-study figures. Source revisions, simulation details, and claim limits are recorded in [project evidence](docs/project-evidence.md).

## Working on it

Use Node.js 24 for the application and native TypeScript data tests. Resume generation uses Python 3 with `reportlab` and `pypdf`; `make resume PYTHON=/path/to/python3` selects an interpreter that has them installed.

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # eslint
npm test             # routes, curation, study schema, and evidence assets
npm run format:check # prettier
npm run resume       # rebuild public/resume.pdf (needs: pip install reportlab pypdf)
npm run check-links  # verify every project URL and update the checked date
```

No environment variables are required.

## Deploying

Pushes to `master` deploy to production through the Vercel Git integration. Do not run `vercel --prod` by hand; it does not move the production alias.

Before a source PR, update `HANDOVER.md`, run `make verify` and `make build`, regenerate the resume when shared facts change, and inspect desktop/phone layouts and the PDF. Keep all seventeen existing public project slugs and the hidden Plugrade redirect intact.

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
