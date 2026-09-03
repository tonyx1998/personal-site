# personal-site

The portfolio and résumé of **To Yin Yu**, live at [www.toyinyu.com](https://www.toyinyu.com).

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion. Hosted on Vercel.

## How the site is put together

- `src/lib/projects.data.json` is the single source of truth for every project. The homepage, the archive at `/projects`, each `/projects/<slug>` page, the sitemap, the JSON-LD, and the résumé PDF all read from it. Edit the JSON, then regenerate the résumé.
- `src/components/PortfolioHome.tsx` renders the homepage. Its four hero cards are hand-picked in that file, so adding a project to the JSON does not put it on the homepage.
- `src/components/ProjectsAll.tsx` renders the archive: four selected projects at full size, the rest in a compact list. A project with `"hidden": true` is left out of the archive, the sitemap, and the routes.
- `src/app/layout.tsx` ships the page with the dark class and a small pre-hydration script that reads `localStorage.theme`, so there is no theme flash and every route can be statically rendered.
- `scripts/build-resume.py` generates `public/resume.pdf` from the `resume` block of each project entry.

## Working on it

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # eslint
npm run format:check # prettier
npm run resume       # rebuild public/resume.pdf (needs: pip install reportlab pypdf)
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
│   ├── providers.tsx           theme store (localStorage)
│   ├── sitemap.ts, robots.ts
│   └── icon, apple-icon, opengraph-image, twitter-image
├── components/
│   ├── PortfolioChrome.tsx     header and footer
│   ├── PortfolioHome.tsx       homepage sections
│   └── ProjectsAll.tsx         archive list
└── lib/
    ├── projects.data.json      project roster (source of truth)
    ├── projects.ts             types, slug helper, hidden filter
    ├── project-visuals.ts      screenshot paths and alt text
    ├── site.ts                 canonical URL
    └── structured-data.ts      JSON-LD builders
public/projects/                product screenshots (1280×720)
public/resume.pdf               generated résumé
scripts/build-resume.py         résumé generator
```

## License

All rights reserved. © To Yin Yu.
