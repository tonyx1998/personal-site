<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# personal-site

Portfolio site for To Yin Yu — Next.js 16, React 19, Tailwind v4, Framer Motion. Live at www.toyinyu.com. The default branch is `master`.

## Commands

- `make setup` — `npm ci`, copy `.env.example` → `.env`
- `make dev` — local dev server
- `make build` — production build
- `make verify` — eslint + prettier check (run before opening a PR)
- `make resume` — regenerate `public/resume.pdf` from `src/lib/projects.data.json`

## Rules

- `src/lib/projects.data.json` is the only place project facts live. Edit it, then run `make resume`. Never hand-edit `public/resume.pdf`.
- Keep every route statically renderable. Do not read `cookies()` or `headers()` in the root layout; the theme comes from `localStorage` via the bootstrap script in `layout.tsx`.
- Content must be visible without JavaScript. Animate from a visible resting state; never ship an element at `opacity: 0` waiting on a scroll observer.
- Respect `prefers-reduced-motion` for animations.
- No environment variables are required. Do not add server routes that call paid APIs unless a page actually uses them.
- Update `HANDOVER.md` in the same PR as any source change (CI checks this).
- Do not run `vercel --prod`; pushes to `master` deploy through the Git integration.
