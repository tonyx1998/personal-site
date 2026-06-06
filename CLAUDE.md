@AGENTS.md

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
