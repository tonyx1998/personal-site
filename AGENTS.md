<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# personal-site

Portfolio site for To Yin Yu — Next.js 16, React 19, Tailwind v4, Framer Motion. Live at www.toyinyu.com.

## Commands

- `make setup` — `npm ci`, copy `.env.example` → `.env`
- `make dev` — local dev server
- `make build` / `make test` — production build

## Rules

- Never commit `.env` or Web3Forms keys
- Preserve server-rendered theme (cookie-based, no FOUC)
- Respect `prefers-reduced-motion` for animations
- Contact form uses `NEXT_PUBLIC_WEB3FORMS_KEY` only — no custom backend
