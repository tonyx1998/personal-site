export type Project = {
  title: string;
  description: string;
  highlights?: string[];
  tags: string[];
  github: string | null;
  live: string | null;
  featured: boolean;
  className: string;
  datePublished?: string;
  dateModified?: string;
};

export const projects: Project[] = [
  {
    title: "Throughline — Technical Learning Ecosystem",
    description:
      "The hub for a connected set of first-principles technical learning guides — a 5-act ladder (Code → Specialize → Build → Prep → Practice) linking every guide plus SoloMock and Shipyard into one path from absolute beginner to job-ready.",
    highlights: [
      "Designed and shipped a static Astro hub that maps the whole ecosystem as a 5-act learning ladder, routing readers from a programming on-ramp through specialization guides into building and interview practice",
      "Unified every guide on one house design system (`@throughline/guide-kit`) and a single pedagogical standard — readers enter knowing nothing and leave job-ready, read top-to-bottom",
      "Source-available across the ecosystem (© 2026 To Yin Yu, All Rights Reserved), with in-browser interactive code and checkpoint quizzes throughout",
    ],
    tags: ["Astro", "TypeScript", "Design System", "Vercel"],
    github: null,
    live: "https://throughline-ashen.vercel.app",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2026",
  },
  {
    title: "SoloYap",
    description:
      "Realtime voice English tutor — practice spoken English with an AI partner over scenarios like ordering coffee, doctor visits, and salary negotiation, with grammar corrections after every turn.",
    highlights: [
      "Built the realtime voice loop on OpenAI's Realtime API over WebRTC; instant grammar corrections and better-phrasing suggestions stream back after every learner turn",
      "Authored 13 CEFR-graded scenarios (A2–C1) plus free-chat and custom-topic modes, with optional Mandarin/Cantonese native-language hints to lower the floor for beginners",
      "Shipped as an installable PWA with manifest + apple-touch icons; layered cost protection via per-IP rate limits, session caps, and an email-allowlist request-access flow",
    ],
    tags: [
      "Next.js",
      "React 19",
      "TypeScript",
      "OpenAI Realtime API",
      "WebRTC",
      "Tailwind CSS",
      "PWA",
    ],
    github: null,
    live: "https://soloyap.com",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2025",
  },
  {
    title: "SoloMock",
    description:
      "Verbal mock-interview app — talk through coding problems out loud with an AI interviewer over realtime voice, get instant feedback.",
    highlights: [
      "Built the realtime voice loop on OpenAI's GA Realtime API over WebRTC; debounced code-editor snapshots stream into the model so the AI reacts to what you type, not just what you say",
      "Authored 15 structured per-problem 'interviewer briefs' (solution tree, 4-rung Socratic hint ladder, follow-ups, edge cases) that drive interviewer behavior via the system prompt",
      "Layered cost protection: per-IP rate limit, 15-min session cap, ephemeral key TTL, and a Discord-webhook extended-access request flow with manual-whitelist approval",
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "OpenAI Realtime API",
      "WebRTC",
      "Monaco",
      "Tailwind CSS",
    ],
    github: null,
    live: "https://solomock.com",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2025",
  },
  {
    title: "all-in-one-URL",
    description: "Short links, QR codes, barcodes, and analytics platform.",
    highlights: [
      "Built FastAPI backend with PostgreSQL, Redis caching, and tiered rate limiting",
      "Added JWT auth and per-resource ownership while preserving anonymous resources",
      "Deployed full stack on Vercel, Render, Neon, and Upstash",
    ],
    tags: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Docker",
      "React",
      "TypeScript",
    ],
    github: null,
    live: "https://all-in-one-url.vercel.app",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2024",
  },
  {
    title: "Gasolytics — US Gas Price Map",
    description:
      "Live US gas-price tracker — an interactive map of all 50 states + DC with daily AAA averages, per-state metro breakdowns, and price trends.",
    highlights: [
      "Built an interactive d3-geo choropleth projected to SVG server-side (so no d3 ships to the client), with metro price pins, hover tooltips, wheel-zoom/drag-pan, and a per-state detail panel",
      "Scrapes AAA's state-averages page server-side for all 50 states + DC across 4 fuel grades, caching in memory and accruing daily per-state and per-metro price-history snapshots",
      "Shipped on Next.js 16 (Turbopack) + React 19; deployed to Vercel with a daily cron snapshot route",
    ],
    tags: [
      "Next.js",
      "React 19",
      "TypeScript",
      "d3-geo",
      "Web Scraping",
      "Vercel",
    ],
    github: null,
    live: "https://www.gasolytics.com/",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2026",
  },
  {
    title: "Roofing Site + AI Voice Booking Agent",
    description:
      "Marketing site for a local roofing business with an embedded AI voice agent that answers FAQs, triages emergency requests, and books real inspection appointments.",
    highlights: [
      "Shipped Astro + Tailwind site with a multi-step quote estimator, project gallery, FAQ chatbot, and SEO-optimized routing",
      "Integrated an ElevenLabs voice agent to answer roofing FAQs and triage emergency vs. routine requests in natural conversation",
      "Wired the agent's webhook tools to the Cal.com API so callers book real inspection appointments end-to-end without human handoff",
    ],
    tags: [
      "Astro",
      "TypeScript",
      "Tailwind CSS",
      "ElevenLabs",
      "Cal.com API",
      "Vercel",
    ],
    github: null,
    live: "https://premier-roofing-co.vercel.app",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2025",
  },
  {
    title: "Programming Basics",
    description:
      "A zero-to-programming foundational on-ramp guide — the prerequisite track the other Throughline guides link to, taking absolute beginners from nothing to ready-to-specialize.",
    highlights: [
      "Authored a first-principles, read-top-to-bottom introduction to programming for readers with no prior experience, serving as the shared entry point for the specialization guides",
      "Built as an interactive Docusaurus course with in-browser code and checkpoint quizzes, on the shared `@throughline/guide-kit` design system",
      "Source-available (© 2026 To Yin Yu, All Rights Reserved); deployed on Vercel",
    ],
    tags: ["Docusaurus", "TypeScript", "React", "MDX"],
    github: null,
    live: "https://programming-basics-three.vercel.app",
    featured: false,
    className: "lg:col-span-1",
    datePublished: "2026",
  },
  {
    title: "Modern Web Dev Guide",
    description:
      "A 2026 web dev guide turned into an interactive course — 17 chapters plus a capstone, ~700 quiz questions, mandatory checkpoints, and progressive chapter unlock.",
    highlights: [
      "Built a sampled-quiz engine with a ~700-question bank, per-session seeded shuffling, and localStorage state",
      "Wired progressive sidebar locking so each chapter unlocks only after its prereq quiz passes",
      "Authored 17 chapters plus a capstone across foundations, lifecycle, tech stack, scale workflows, AI, and career — refreshed for 2026 currency",
    ],
    tags: ["Docusaurus", "TypeScript", "React", "MDX", "Mermaid"],
    github: "https://github.com/tonyx1998/modern-web-dev-guide",
    live: "https://tonyx1998.github.io/modern-web-dev-guide/",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2026",
  },
  {
    title: "Modern AI Guide",
    description:
      "A 2026 AI engineering guide — 18 chapters from how LLM systems actually work to shipping evaluated production AI, with interactive checkpoint quizzes and runnable in-browser Python challenges.",
    highlights: [
      "Authored 18 chapters spanning LLM foundations, project lifecycle, the modern AI tech stack, solo/startup/enterprise workflows, decision frameworks, production patterns, and career paths",
      "Built an interactive Quiz React component with per-chapter checkpoint quizzes that verify understanding before progressing",
      "Deployed via Docusaurus + MDX + Mermaid on GitHub Pages — beginner-readable but still useful for working engineers",
    ],
    tags: ["Docusaurus", "TypeScript", "React", "MDX", "Mermaid"],
    github: "https://github.com/tonyx1998/modern-ai-guide",
    live: "https://tonyx1998.github.io/modern-ai-guide/",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2026",
  },
  {
    title: "Modern Security Engineer Guide",
    description:
      "A 2026 security engineering guide — 14 chapters of offensive and defensive security, from the attacker's mindset to a job-ready security engineer, with interactive checkpoint quizzes and hands-on code challenges.",
    highlights: [
      "Authored 14 chapters across 7 parts — cryptography, application security (OWASP Top 10), secure SDLC, offensive testing, detection & response, incident forensics, cloud/identity, governance, and the new AI attack surface (prompt injection, LLM Top 10, AI red-teaming)",
      "Built interactive Quiz and CodeChallenge React components with per-chapter checkpoints that gate progress until concepts are demonstrated, plus an in-page feedback widget",
      "Deployed via Docusaurus + MDX + Mermaid on GitHub Pages — first-principles for absolute beginners but sharp enough as a 2026 refresh for working engineers; pairs with the Web Dev and AI Engineer guides",
    ],
    tags: ["Docusaurus", "TypeScript", "React", "MDX", "Mermaid"],
    github: "https://github.com/tonyx1998/modern-security-engineer-guide",
    live: "https://tonyx1998.github.io/modern-security-engineer-guide/",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2026",
  },
  {
    title: "Modern Cloud Engineer Guide",
    description:
      "A 2026 first-principles cloud engineering guide — from cloud foundations and core services through Infrastructure-as-Code, Kubernetes, CI/CD, SRE, and platform engineering.",
    highlights: [
      "Structured an 11-chapter path from cloud foundations and core services to Infrastructure-as-Code, Kubernetes, CI/CD, SRE, and platform engineering (Ch 1–4 fully authored, 5–11 outlined)",
      "Built as an interactive Docusaurus course with checkpoint quizzes and Mermaid diagrams, on the shared `@throughline/guide-kit` design system",
      "Source-available (© 2026 To Yin Yu, All Rights Reserved); deployed on Vercel as part of the Throughline ecosystem",
    ],
    tags: ["Docusaurus", "TypeScript", "React", "MDX", "Mermaid"],
    github: null,
    live: "https://modern-cloud-engineer-guide.vercel.app",
    featured: false,
    className: "lg:col-span-1",
    datePublished: "2026",
  },
  {
    title: "Shipyard",
    description:
      "A guided platform where you build a portfolio-grade project and get it AI-graded (Claude-as-judge) — the 'Build' act of Throughline, with a teaching-first coaching loop instead of a pass/fail gate.",
    highlights: [
      "Designed a guided build-and-grade flow that walks a learner through shipping a real, portfolio-grade project, then grades the result with an LLM-as-judge rubric (Claude-as-judge)",
      "Built a teaching-first coaching loop that explains gaps and next steps rather than just scoring, closing the loop from learning into proving you can ship",
      "Source-available (© 2026 To Yin Yu, All Rights Reserved); deployed on Vercel as the 'Prove you can ship' act of the Throughline ladder",
    ],
    tags: ["TypeScript", "React", "Claude / LLM-as-Judge", "Vercel"],
    github: null,
    live: "https://shipyard.vercel.app",
    featured: false,
    className: "lg:col-span-1",
    datePublished: "2026",
  },
  {
    title: "Reachspan",
    description:
      "Landing site for an AI-infused digital marketing service — listens across Reddit, IG, FB, and Nextdoor, scores buying signals in real time, and engages warm leads. Performance-priced, no retainer.",
    highlights: [
      "Designed and shipped a single-file Tailwind + HTML landing with alternating warm-dark hero and cream content sections; custom display/mono typography and scroll-reveal motion throughout",
      "Wired Vercel serverless API routes (`/api/book`, `/api/slots`) to the Cal.com API so audit-call bookings land directly on the calendar with auto-confirmation",
      "Honest positioning copy throughout — spec demos labelled as such, no fabricated KPIs or testimonials; performance-pricing pitch made load-bearing in the FAQ as the agency's core differentiator",
    ],
    tags: ["HTML", "Tailwind CSS", "Vercel Serverless", "Cal.com API"],
    github: null,
    live: "https://reachspan.ai",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
    datePublished: "2026",
  },
  {
    title: "SWE Interview Guide",
    description:
      "Zero-to-hero interview prep — 86 lessons across 16 phases, including AI-era interview rounds (AI-assisted coding, FDE decomposition, RAG, agent and eval design). Companion to SoloMock.",
    highlights: [
      "Authored 86 lessons across 16 phases from foundations through DP, system design, AI-era interview rounds (2024–2026 formats), AI-product engineering, frontend, and behavioral",
      "Built quiz-gated progression with star ratings, a mock interview timer with phase coaching, and a problem tracker that persists to localStorage",
      "Single-file HTML + JS + Tailwind (CDN), hash-based router, no build step — deployed on Vercel as a static asset",
    ],
    tags: ["HTML", "JavaScript", "Tailwind CSS", "Vercel"],
    github: null,
    live: "https://swe-interview-guide.vercel.app",
    featured: false,
    className: "lg:col-span-1",
    datePublished: "2026",
  },
  {
    title: "2026 Skills Roadmap",
    description:
      "Single-page roadmap from zero to a working 2026 web-dev stack — 12 stages across JS, HTML/CSS, browser JS, Git, TypeScript, React, Tailwind, and the modern toolchain.",
    highlights: [
      "Authored 12 sequential learning stages with time budgets, references, and concrete deliverables",
      "Single self-contained HTML file with sticky sidebar nav and dark-mode design tokens",
      "Published via GitHub Pages — zero build step, instant edit-and-push iteration",
    ],
    tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    github: "https://github.com/tonyx1998/skills-roadmap",
    live: "https://tonyx1998.github.io/skills-roadmap/",
    featured: false,
    className: "lg:col-span-1",
    datePublished: "2026",
  },
];
