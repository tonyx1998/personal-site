# Stack & Skills Walkthrough

A teaching-oriented tour of every framework, library, and pattern used to build this portfolio. For each, we cover **what it is**, **what it does for us**, **where it shows up in the code**, and **why it's a relevant industry skill**.

---

## 1. Runtime & framework

### Next.js 16 (App Router + Turbopack)
**What it is:** A full-stack React framework. The "App Router" is its modern routing system based on folder conventions in `src/app/`.

**What we use it for:**
- File-based routing — `src/app/page.tsx` is the homepage automatically
- Server Components by default (rendered on the server, zero JS shipped) — our root layout is a Server Component
- Convention files: `metadata`, `viewport`, `sitemap.ts`, `robots.ts` are all picked up automatically
- Image optimization (we removed it but used it via `next/image`)
- Font optimization via `next/font`
- Dynamic imports via `next/dynamic` for code-splitting

**Where in the code:**
- [src/app/layout.tsx](../src/app/layout.tsx) — async Server Component reading cookies
- [src/app/sitemap.ts](../src/app/sitemap.ts), [src/app/robots.ts](../src/app/robots.ts) — convention-based SEO routes
- [src/components/Contact.tsx](../src/components/Contact.tsx) — uses `next/dynamic` to lazy-load the form

**Why it matters:** Next.js powers a huge slice of production React apps (Vercel, OpenAI's site, TikTok web, etc.). App Router + Server Components is the modern standard.

### React 19
**What it is:** The UI library. Version 19 brought stricter SSR/hydration warnings and concurrent features.

**What we use it for:** Function components, hooks (`useState`, `useEffect`, `useRef`, `useContext`), Suspense via `next/dynamic`.

**Why it matters:** Industry default for component-based UIs. Hooks are required knowledge for any frontend role.

### TypeScript 5
**What it is:** JavaScript with a static type system. Catches bugs at compile time.

**What we use it for:** All `.tsx`/`.ts` files. Types for props (e.g., `{ children: React.ReactNode }`), context values (`ThemeContextValue`), Next metadata (`Metadata`, `Viewport`, `MetadataRoute.Sitemap`).

**Where it shines:** [src/app/providers.tsx](../src/app/providers.tsx) — the theme context is fully typed; `useTheme()` returns a known shape.

**Why it matters:** Almost every modern web team ships in TypeScript. Listed on essentially every frontend job posting.

---

## 2. Styling

### Tailwind CSS v4
**What it is:** A utility-first CSS framework. Instead of writing `.button { padding: 1rem }`, you write `<button class="p-4">`.

**What we use it for:** Every visual style on the site. v4 introduces the new `@theme` directive and CSS-variable-based tokens.

**Where in the code:**
- [src/app/globals.css](../src/app/globals.css) — `@import "tailwindcss"`, custom theme tokens, `prefers-reduced-motion` handling
- Every component — class names like `flex items-center gap-3 rounded-xl border border-border bg-card`

**Industry-relevant patterns demonstrated:**
- **Class-based dark mode** — `@custom-variant dark (&:is(.dark, .dark *))` lets us write `dark:bg-zinc-900`-style overrides
- **Theme tokens via CSS variables** — `--accent` is defined once, used everywhere
- **Responsive breakpoints** — `sm:`, `lg:` prefixes (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- **Arbitrary values** — `h-[169%]`, `text-[12.5px]` for one-off precision
- **Composition with `cn()`** — see below

### `clsx` + `tailwind-merge` (via `cn()`)
**What it is:** Two tiny libraries that compose class names safely. `clsx` joins conditionals; `tailwind-merge` resolves conflicting Tailwind classes (`p-2 p-4` → `p-4`).

**Where in the code:** [src/lib/utils.ts](../src/lib/utils.ts), used in [ProjectCard.tsx](../src/components/ProjectCard.tsx), [Navbar.tsx](../src/components/Navbar.tsx), and [Spotlight.tsx](../src/components/ui/Spotlight.tsx).

**Why it matters:** This pattern is the de-facto standard in the shadcn/ui ecosystem. If you've seen `cn()` in any modern React codebase, this is what it is.

### CSS-variable themes
**What it is:** Define color tokens as `--background: #fff` and reference them as `var(--background)`. Override them under `.dark` for dark mode.

**Where:** [src/app/globals.css](../src/app/globals.css). The `:root { --accent: #6366f1; } .dark { --accent: #818cf8; }` pattern is what gives us instant theme swaps.

### `prefers-reduced-motion`
**What it is:** A media query that tells you whether the user has set "Reduce motion" in their OS accessibility settings.

**What we do:** Globally cancel animations and smooth-scroll for those users — see the `@media (prefers-reduced-motion: reduce)` block in [globals.css](../src/app/globals.css).

**Why it matters:** Accessibility (a11y) is a baseline expectation in 2026. Users with vestibular disorders can be made nauseous by motion; respecting this preference is required for WCAG 2.1 compliance.

---

## 3. Animation

### Framer Motion
**What it is:** A React-first animation library. Wraps any element in `<motion.div>` and pass `initial`/`animate`/`whileInView` props.

**What we use it for:**
- Hero badge, headline, subtitle, CTAs all fade-up on mount
- Section headers and cards animate in `whileInView` (when scrolled into view)
- Mobile nav uses `AnimatePresence` for enter/exit
- Project cards stagger their entrance with `delay: i * 0.08`

**Where:** Every "use client" component — [Hero.tsx](../src/components/Hero.tsx), [Projects.tsx](../src/components/Projects.tsx), [Navbar.tsx](../src/components/Navbar.tsx), etc.

**Why it matters:** Most production React apps use Framer Motion (or its successor `motion`) for nontrivial animation. Knowing the `initial → animate → exit` mental model is portable.

### CSS keyframes (vs. Framer Motion)
**What it is:** Vanilla CSS animations defined with `@keyframes`.

**Where:** The hero Spotlight uses a CSS keyframe (`@keyframes spotlight` in [globals.css](../src/app/globals.css)) instead of Framer Motion. We learned the hard way that `motion.svg` had subtle issues, and CSS keyframes are bulletproof for SVG.

**Lesson:** Pick the right tool. Framer for components, CSS for pure visual effects.

### Cursor-tracking spotlight (mousemove + CSS variables)
**What it is:** Listen to `mousemove`, write `--x` and `--y` CSS variables to the element, then a `radial-gradient(at var(--x) var(--y), ...)` follows the cursor.

**Where:** [src/components/ProjectCard.tsx](../src/components/ProjectCard.tsx) — the `handleMouseMove` handler writes `--x`/`--y` on each card, and the radial gradient is applied in `CardBody`.

**Why it matters:** This is the trick used by Aceternity UI, Magic UI, and countless landing pages. Lightweight, GPU-accelerated, no JS animation loop required.

---

## 4. Icons & SVGs

### lucide-react
**What it is:** A large icon library, tree-shakable — only the icons you import are bundled.

**Where:** Imported throughout (`Mail`, `MapPin`, `Send`, `ArrowDown`, `Menu`, `X`, etc.).

**Why we chose it:** Designer-friendly, consistent stroke weight, tiny per-icon footprint.

### Hand-rolled SVGs
**What it is:** GitHub and LinkedIn icons live in [src/components/Icons.tsx](../src/components/Icons.tsx) as simple React components — no extra dep.

**Why:** Lucide doesn't ship brand logos (they keep the library trademark-clean). Two SVGs is cheaper than another package.

---

## 5. Forms & client-only loading

### Web3Forms
**What it is:** A free service that accepts form POSTs and emails them to you. No backend needed.

**Where:** [src/components/ContactForm.tsx](../src/components/ContactForm.tsx) — `fetch('https://api.web3forms.com/submit', { method: 'POST', body: JSON.stringify(...) })`.

**Why this matters:** Static sites can have working contact forms without a server. Common patterns: Web3Forms, Formspree, Netlify Forms, Resend with a serverless function.

### `next/dynamic` with `ssr: false`
**What it is:** A way to import a component lazily and skip server-side rendering for it.

**Where:** [src/components/Contact.tsx](../src/components/Contact.tsx) — `const ContactForm = dynamic(() => import("./ContactForm"), { ssr: false, loading: () => <Skeleton /> })`

**Why we used it:** Some browser extensions inject DOM nodes into form inputs *before* React hydrates the page, causing hydration mismatch errors. Loading the form client-only means the SSR HTML has no inputs for extensions to target — error eliminated.

**Skill demonstrated:** Understanding the SSR/CSR boundary, hydration, and when to opt out of SSR.

### `AbortController` + timeout
**Where:** [ContactForm.tsx](../src/components/ContactForm.tsx) — the fetch is cancelled if it takes >10s.

**Why it matters:** Production-quality network code always has a timeout. Hanging promises eat memory and frustrate users.

---

## 6. SEO & metadata

### Next.js Metadata API
**What it is:** Export a `metadata` object (or function) from a route file; Next renders the corresponding HTML head tags for you.

**Where:** [src/app/layout.tsx](../src/app/layout.tsx)

**What we set:**
- `metadataBase` — required for absolute URL resolution
- `title.default` + `title.template` — `%s · To Yin Yu` for nested routes
- `description` — search engine snippet
- `openGraph` — Facebook, LinkedIn, Slack rich previews
- `twitter` — X/Twitter card preview
- `robots` — search-engine indexing rules
- `icons` — favicon

### `viewport` export
**What it is:** A separate export for things that change between server-rendered pages, like `themeColor`.

**Where:** [src/app/layout.tsx](../src/app/layout.tsx) — sets `theme-color` per `prefers-color-scheme` so mobile Safari/Chrome match the URL bar to your theme.

### `sitemap.ts` / `robots.ts` conventions
**What it is:** Special filenames Next 16 picks up to serve `/sitemap.xml` and `/robots.txt`.

**Where:** [src/app/sitemap.ts](../src/app/sitemap.ts), [src/app/robots.ts](../src/app/robots.ts).

**Why it matters:** Search engines need a sitemap to discover and index your pages efficiently. `robots.txt` tells crawlers what to skip and where the sitemap lives.

### Dynamic Open Graph & icon images
**What it is:** Social-share cards and favicons generated from JSX via `ImageResponse` (from `next/og`) instead of hand-made PNGs.

**Where:** [src/app/opengraph-image.tsx](../src/app/opengraph-image.tsx) (re-exported by [twitter-image.tsx](../src/app/twitter-image.tsx)), plus [icon.tsx](../src/app/icon.tsx) and [apple-icon.tsx](../src/app/apple-icon.tsx) — Next's file-convention metadata image routes, auto-wired by filename (no manual `<meta>` tags).

**Why it matters:** One JSX source of truth for every link preview and icon — edit the markup and the cards regenerate, no design-tool round-trip. They appear as prerendered (`○`) routes in the build output: `/opengraph-image`, `/icon`, `/apple-icon`, `/twitter-image`.

### JSON-LD structured data
**What it is:** Machine-readable [schema.org](https://schema.org) descriptions of the site, emitted as `<script type="application/ld+json">` — a `Person` and `WebSite` on the home page, and a `CollectionPage` + `ItemList` of projects on `/projects`.

**Where:** [src/lib/structured-data.ts](../src/lib/structured-data.ts) defines the objects and a `jsonLdScriptProps()` helper (which escapes `<` to `<`); they're rendered from [src/app/page.tsx](../src/app/page.tsx) and [src/app/projects/page.tsx](../src/app/projects/page.tsx). The project list is derived from `projects.ts`, so it stays in sync automatically.

**Why it matters:** Helps search engines and AI crawlers understand who the site is about and what it links to, making the pages eligible for richer results.

---

## 7. Theming (the interesting part)

### Cookie-based theme on a Server Component
**What it does:** The root layout reads a `theme` cookie via `next/headers`'s `cookies()` and renders `<html className="... dark">` server-side. No script needed, no flash of unstyled content.

**Where:** [src/app/layout.tsx](../src/app/layout.tsx) — `const theme = (await cookies()).get("theme")?.value`

### React Context provider with cookie + localStorage write-through
**What it does:** Client-side, the [Providers](../src/app/providers.tsx) component writes the theme to both a cookie (so the server picks it up next request) and localStorage (as a fallback).

**Why we built our own instead of using `next-themes`:** `next-themes@0.4.6` injects a `<script>` tag that React 19 warns about. Our cookie-based approach sidesteps that entirely.

**Skills demonstrated:** Building a typed React Context, understanding hydration, the cookie/localStorage trade-off, server/client boundaries in App Router.

---

## 8. Build & deploy

### Vercel
**What it is:** The hosting platform built by the makers of Next.js. Optimized for Next deployments.

**What it gives us:** GitHub auto-deploy, edge CDN, image optimization, ISR/SSG support, deployment previews per branch.

**Project URL:** [www.toyinyu.com](https://www.toyinyu.com)

### Turbopack
**What it is:** The Rust-based bundler that replaced Webpack in Next 16 by default. Significantly faster builds and HMR.

**You see it in:** the build output banner — `▲ Next.js 16.2.6 (Turbopack)`.

### Static (`○`) vs. Dynamic (`ƒ`) routes
**What it is:** Next labels each route at build time. `○` = prerendered HTML at build. `ƒ` = rendered per request.

**Why it matters here:** Our `/sitemap.xml` and `/robots.txt` are `○` (cached forever, instant). The home page is `ƒ` (per-request, because we read the theme cookie). Vercel handles both gracefully.

---

## 9. Tooling

### ESLint
**What it is:** A linter that catches bad patterns in your code.

**Where:** [eslint.config.mjs](../eslint.config.mjs) — uses `eslint-config-next`.

**Notable rule we worked around:** `react-hooks/set-state-in-effect` (new in React 19) flags the classic `mounted` hydration-safety pattern. We use `// eslint-disable-next-line` to acknowledge it intentionally.

### Geist + Geist Mono (`next/font`)
**What it is:** Vercel's house typeface, loaded via Next's optimized font system (no FOUT, served from your domain, no CLS).

**Where:** [src/app/layout.tsx](../src/app/layout.tsx) — `Geist({ variable: "--font-geist-sans", subsets: ["latin"] })`. Then Tailwind picks up `--font-geist-sans` via `--font-sans` in `@theme`.

### `npm overrides`
**What it is:** A `package.json` field that forces a specific version of a transitive dependency.

**Where:** [package.json](../package.json) — `"overrides": { "postcss": "^8.5.11" }` patches a moderate-severity vulnerability that ships inside Next's bundled postcss without breaking anything.

**Skill demonstrated:** Knowing how to triage `npm audit` findings without panic-running `--force`.

---

## 10. Resume generation (Python side-project)

### `reportlab`
**What it is:** A Python PDF generation library.

**Where:** [scripts/build-resume.py](../scripts/build-resume.py)

**What it does:** Generates a single-page, ATS-friendly resume PDF — same source-of-truth as the website's "Download Resume" button.

**Why this is cool:** Your resume content is in one place (the script). Edit, regenerate, ship — no Word fiddling.

---

## What this codebase signals to a recruiter or interviewer

| Skill | Demonstrated by |
| --- | --- |
| **TypeScript fluency** | Typed React Context, Next `Metadata`/`Viewport`, generic helper utils |
| **Modern Next.js** | App Router, Server Components, async layouts reading cookies, dynamic imports |
| **CSS-in-class fluency** | Tailwind v4, theme tokens, `cn()` composition, responsive breakpoints |
| **Animation craft** | Framer Motion + CSS keyframes + cursor-tracked spotlights, knowing when to use which |
| **Performance-mindedness** | Static where possible, dynamic where needed, lazy-loaded form, passive scroll listener, prefers-reduced-motion |
| **Hydration / SSR understanding** | Cookie-based theming, client-only ContactForm, `suppressHydrationWarning` boundaries |
| **A11y baseline** | Reduced-motion, semantic HTML, aria-labels, focus rings on inputs |
| **SEO baseline** | Metadata API, OG/Twitter cards, sitemap, robots, theme-color |
| **Build/deploy** | Vercel + Turbopack + npm overrides for vuln triage |
| **Pragmatism** | Replaced `next-themes` with 50 lines of code when it broke; replaced a low-res photo with a code card; chose Web3Forms over building a backend |
| **Cross-stack** | Python + reportlab for the resume PDF |

---

## How to study this further

- **Next.js docs**: https://nextjs.org/docs/app
- **React docs**: https://react.dev (especially the "You might not need an effect" article)
- **Tailwind docs**: https://tailwindcss.com/docs
- **Framer Motion**: https://motion.dev/docs/react-quick-start
- **Web a11y**: https://web.dev/learn/accessibility/
- **Aceternity UI** (free demos to study modern animation patterns): https://ui.aceternity.com/

---

*Last updated: 2026-05. Tracks the state of the codebase on the `master` branch.*
