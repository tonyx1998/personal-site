# Stack

What the site is built with and why each piece is there. Kept short on purpose; the code is small enough to read directly.

## Framework and rendering

**Next.js 16.4.6, React 19.2.8, Node.js 24.** Every route is a Server Component except the small client pieces that need state: the home carousel, the header with its mobile menu, and the project table.

**Static rendering.** Nothing on the site reads request data, so every page can be prerendered at build time and served from the Vercel CDN. The project pages use `generateStaticParams` over the JSON roster. Do not add `cookies()` or `headers()` to the root layout; that would turn every route dynamic again.

**Light-only.** The site has one set of color tokens in `globals.css`. There is no dark theme, no theme switch and no pre-hydration script.

## Data

**`src/lib/projects.data.json`** holds every project: title, description, year, tags, links, highlights, and an optional `resume` block. `projects.ts` types it, derives the URL slug from the title, and filters out `hidden` entries. The sitemap, JSON-LD, archive, and project pages all import from there.

**`scripts/build-resume.py`** turns the `resume` blocks into a tagged `public/resume.pdf` with WeasyPrint and validates it with pypdf. The renderer is build tooling only; the site serves the generated static file. Python dependencies are pinned in `scripts/requirements-resume.txt`, with a bundled, licensed Public Sans font for predictable rendering. Run `npm run resume` after editing the JSON.

## Styling and motion

**Tailwind CSS v4** for the few body utilities, with CSS Modules (`Chrome.module.css`, `PortfolioHome.module.css`, `ProjectsAll.module.css`, `ProjectDetail.module.css`, `not-found.module.css`) for the layouts. Design tokens (ground, frame, ink, line, accent) live in `globals.css` as a single light set.

**No animation library on the content pages.** The only motion there is a hover reveal on screenshot links. Everything is visible at rest, so the page reads the same with JavaScript off. `globals.css` zeroes transitions under `prefers-reduced-motion: reduce`.

**Newsreader** (headings, variable weight with optical sizing) and **Public Sans** (text) are loaded through `next/font`. Only normal styles are requested; the site does not use Newsreader italic.

## The work table (`/table`)

The one page with a 3D scene. Six projects are paper prints on a cutting mat. A visitor can pick a print up, carry it, throw it and stack it; a click or tap opens the project.

**It is a normal page first.** `ProjectTable.tsx` renders the prints as HTML links. Their places on the mat are set by hand in `ProjectTable.module.css`, as shares of the mat: one large print, most of them square to the grid, two turned, one resting on the corner of another, and a second arrangement for narrow screens. Each print sizes its border, picture and caption from its own width with container units. With JavaScript off, without WebGL 2, or with reduced motion, that is the whole page. The row of project names is the keyboard and screen-reader route in every case; the prints themselves are hidden from assistive technology, like the thumbnails in the archive. The line under each name comes from `exhibition.label` in the project data.

**The 3D scene is an extra.** `ProjectTableScene.tsx` uses three.js through React Three Fiber and the Rapier physics engine through `@react-three/rapier`. It is imported only by `/table`, with `next/dynamic` and `ssr: false`, after the page is idle. It is about 0.8 MB of script over the network (1.05 MB with gzip), most of it the physics engine; no other route downloads it, and the home page's scripts are unchanged. The scene does not start by itself when the visitor asked for reduced motion or reduced data, or when the browser can only draw WebGL in software (`failIfMajorPerformanceCaveat`, or a software renderer by name); those visitors get a button. If a scene that started by itself cannot hold about 20 frames a second, it switches itself off and the flat prints stay.

**The two versions are the same picture.** The camera looks straight down and one world unit is 100 CSS pixels, so a print that lies flat is drawn exactly where the HTML print is. The scene has no layout of its own: it reads each print's box, turn and layer from the page, and paints each 3D print from the HTML one (paper, picture, and the caption word by word) onto a canvas texture. Colours therefore still come from the tokens in `globals.css`. Depth shows only when a print is lifted, leaned or stacked.

**Shadows are drawn, not computed.** Each print has two soft pictures of a rectangle, made the way a browser draws a `box-shadow`: a tight one for a print that lies flat (the same numbers as the CSS shadow of the flat print) and a wide one that takes over, and slides away, as the print rises. There is no shadow map, so the shadows are smooth on every device and cost almost nothing.

**Mouse and touch differ on purpose.** A mouse drags a print at once. A finger has to rest on a print for a moment before the print is picked up; a quicker swipe scrolls the page, and a tap opens the project. Without that, a phone visitor could not scroll past the mat.

**It rests when nothing moves.** The frame loop stops once every print is asleep and while the mat is off screen.

**Versions.** three.js is pinned to 0.182.0: React Three Fiber 9.8 still uses the `Clock` class that three.js deprecated in the next release, and that logs a console warning. The physics engine logs one deprecation warning of its own when it starts; that comes from inside the library.

## SEO

Metadata API for titles and descriptions, file-convention `opengraph-image.tsx` and `twitter-image.tsx` for share cards, `sitemap.ts` and `robots.ts` generated from the roster, and JSON-LD (`Person`, `WebSite`, `CollectionPage`, `CreativeWork`, `BreadcrumbList`) from `structured-data.ts`.

## Tooling

ESLint (`eslint-config-next`), Prettier, TypeScript strict, React Compiler enabled in `next.config.ts`. Vercel Web Analytics is included through `@vercel/analytics`.

The Verify workflow checks the site and résumé on pull requests and master pushes.
The October 2026 compatible dependency refresh removes an obsolete PostCSS
override so Next.js can use its patched release. The November 25 update moves
Next.js to 16.4.6, the release that closes the advisories reported for 16.0.0
to 16.4.4, and `npm audit` reports no advisory for production or development
dependencies.

`next.config.ts` sends four security headers with every response:
`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy: strict-origin-when-cross-origin` and a `Permissions-Policy`
that switches off the camera, microphone, geolocation and topics APIs. There
is no Content-Security-Policy: the framework's inline scripts would need a
nonce on every request, which a statically rendered site cannot supply.
