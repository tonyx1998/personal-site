# personal-site

The portfolio and résumé of **To Yin Yu**, live at [www.toyinyu.com](https://www.toyinyu.com).

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 plus CSS Modules. Newsreader and Public Sans through `next/font`. Hosted on Vercel.

## How the site is put together

- `src/lib/projects.data.json` is the single source of truth for every project. The homepage, the archive at `/projects`, each `/projects/<slug>` page, the sitemap, the JSON-LD, and the résumé PDF all read from it. Edit the JSON, then regenerate the résumé.
- `src/components/PortfolioHome.tsx` renders three `featured` projects as image-and-text rows and four `homepageCompact` projects as smaller entries. The archive still includes every visible record. `homepageSummary` and `contribution` keep the homepage concise; `caseStudy` contains the longer explanation and evidence.
- `src/components/ProjectsAll.tsx` renders the archive: featured projects with thumbnails, the rest as compact rows. A project with `"hidden": true` is left out of the homepage, the archive, the sitemap, and the routes.
- `src/components/ProjectTable.tsx` renders `/table`, the work table: six projects as paper prints on a mat, placed by hand in its stylesheet. The page is complete as plain HTML. When the browser has a graphics card and the visitor has not asked for reduced motion, it then loads `ProjectTableScene.tsx`, which swaps the flat prints for 3D ones that can be picked up, thrown and stacked. See [the stack notes](docs/STACK.md).
- `src/app/layout.tsx` is the root layout. The site is light-only: there is no dark theme and no theme switch. Every route is statically rendered.
- `scripts/build-resume.py` generates the one-page `public/resume.pdf` from explicit project profiles and the shared `resume` fields. It validates the staged document before replacing the previous PDF. See [resume tailoring](docs/resume-tailoring.md).
- `scripts/check-links.mjs` fetches every project URL and reports the ones that fail. It changes no file.
- `public/projects/evidence/` contains six labeled product demonstrations and public captures. The 1280-pixel images serve as covers; the 2× originals are used for case-study figures. Source revisions, simulation details, and claim limits are recorded in [project evidence](docs/project-evidence.md).

## Working on it

Use Node.js 24 (pinned in `.node-version`) for the application and native TypeScript data tests. Resume generation uses Python 3.13, WeasyPrint, pypdf, and Pango; install the pinned packages in `scripts/requirements-resume.txt` after following the platform setup in [resume tailoring](docs/resume-tailoring.md). `make resume PYTHON=/path/to/python3` selects that interpreter.

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # eslint
npm test             # routes, curation, study schema, and evidence assets
npm run typecheck    # generate route types and run TypeScript
npm run format:check # prettier
npm run resume       # rebuild and validate the tagged public/resume.pdf
npm run check-links  # verify every project URL
```

No environment variables are required.

The Verify workflow runs lint, data tests, formatting, types, a production build,
and the Python résumé regression suite for pull requests and master pushes.
Run `python -m unittest discover -s scripts -p 'test_resume.py'` locally with the
résumé dependencies installed.

## Deploying

Pushes to `master` deploy to production through the Vercel Git integration. Do not run `vercel --prod` by hand; it does not move the production alias.

Before a source PR, update `HANDOVER.md`, run `make verify` and `make build`, regenerate the resume when shared facts change, and inspect desktop/phone layouts and the PDF. Keep the seven public project slugs intact. Plugrade, the seven course projects and the three learning-tool projects are hidden, and their old pages redirect to `/projects`. The roofing case study moved to `/projects/amex-roofing`; its old address redirects there.

## Layout

```
src/
├── app/
│   ├── layout.tsx              root layout and metadata
│   ├── page.tsx                homepage
│   ├── projects/page.tsx       archive
│   ├── projects/[slug]/        one page per project
│   ├── table/page.tsx          work table (prints you can move)
│   ├── not-found.tsx           404
│   ├── sitemap.ts, robots.ts
│   └── icon, apple-icon, opengraph-image, twitter-image
├── components/
│   ├── Chrome.module.css       page shell, header, footer
│   ├── PortfolioChrome.tsx     header and footer
│   ├── PortfolioHome.tsx       homepage
│   ├── ProjectsAll.tsx         archive
│   ├── ProjectTable.tsx        work table: flat prints, loads the 3D scene
│   └── ProjectTableScene.tsx   the 3D scene (three.js and Rapier), /table only
└── lib/
    ├── projects.data.json      project roster (source of truth)
    ├── projects.ts             types, slug helper, hidden filter
    ├── project-visuals.ts      screenshot paths and alt text
    ├── site.ts                 canonical URL
    └── structured-data.ts      JSON-LD builders
public/projects/                product screenshots (1280×720)
public/resume.pdf               generated résumé
scripts/build-resume.py         résumé generator
scripts/check-links.mjs         link check for every project URL
```

## License

All rights reserved. © To Yin Yu.
