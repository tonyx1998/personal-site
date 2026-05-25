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
    title: "SoloYap",
    description:
      "Realtime voice English tutor — practice spoken English with an AI partner over scenarios like ordering coffee, doctor visits, and salary negotiation, with grammar corrections after every turn.",
    highlights: [
      "Built the realtime voice loop on OpenAI's Realtime API over WebRTC; instant grammar corrections and better-phrasing suggestions stream back after every learner turn",
      "Authored 13 CEFR-graded scenarios (A2–C1) plus free-chat and custom-topic modes, with optional Mandarin/Cantonese native-language hints to lower the floor for beginners",
      "Shipped as an installable PWA with manifest + apple-touch icons; layered cost protection via per-IP rate limits, session caps, and an email-allowlist request-access flow",
    ],
    tags: ["Next.js", "React 19", "TypeScript", "OpenAI Realtime API", "WebRTC", "Tailwind CSS", "PWA"],
    github: null,
    live: "https://soloyap.com",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
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
    tags: ["Next.js", "TypeScript", "OpenAI Realtime API", "WebRTC", "Monaco", "Tailwind CSS"],
    github: null,
    live: "https://solomock.com",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "all-in-one-URL",
    description: "Short links, QR codes, barcodes, and analytics platform.",
    highlights: [
      "Built FastAPI backend with PostgreSQL, Redis caching, and tiered rate limiting",
      "Added JWT auth and per-resource ownership while preserving anonymous resources",
      "Deployed full stack on Vercel, Render, Neon, and Upstash",
    ],
    tags: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "React", "TypeScript"],
    github: null,
    live: "https://all-in-one-url.vercel.app",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "United Front Roofing",
    description: "Marketing site for a roofing business with an embedded AI voice booking agent.",
    highlights: [
      "Shipped Astro + Tailwind site with quote estimator and project gallery",
      "Integrated ElevenLabs voice agent to answer FAQs and triage emergency requests",
      "Wired webhook tools to Cal.com API to book real inspection appointments end-to-end",
    ],
    tags: ["Astro", "TypeScript", "Tailwind CSS", "ElevenLabs", "Cal.com API", "Netlify"],
    github: null,
    live: "https://united-front-roofing.netlify.app",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Modern Web Dev Guide",
    description:
      "A 2026 web dev guide turned into an interactive course — ~700 quiz questions, mandatory checkpoints, and progressive chapter unlock.",
    highlights: [
      "Built a sampled-quiz engine with a ~700-question bank, per-session seeded shuffling, and localStorage state",
      "Wired progressive sidebar locking so each chapter unlocks only after its prereq quiz passes",
      "Authored 11 chapters across foundations, lifecycle, tech stack, scale workflows, AI, and career",
    ],
    tags: ["Docusaurus", "TypeScript", "React", "MDX", "Mermaid"],
    github: "https://github.com/tonyx1998/modern-web-dev-guide",
    live: "https://tonyx1998.github.io/modern-web-dev-guide/",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Modern AI Engineer Guide",
    description:
      "A 2026 AI engineering guide — 12 chapters from how LLM systems actually work to shipping evaluated production AI, with interactive checkpoint quizzes per chapter.",
    highlights: [
      "Authored 12 chapters spanning LLM foundations, project lifecycle, the modern AI tech stack, solo/startup/enterprise workflows, decision frameworks, production patterns, and career paths",
      "Built an interactive Quiz React component with per-chapter checkpoint quizzes that verify understanding before progressing",
      "Deployed via Docusaurus + MDX + Mermaid on GitHub Pages — beginner-readable but still useful for working engineers",
    ],
    tags: ["Docusaurus", "TypeScript", "React", "MDX", "Mermaid"],
    github: "https://github.com/tonyx1998/modern-ai-engineer-guide",
    live: "https://tonyx1998.github.io/modern-ai-engineer-guide/",
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "SWE Interview Guide",
    description:
      "Zero-to-hero interview prep — 69 lessons across 16 phases, including AI-era interview rounds (AI-assisted coding, FDE decomposition, RAG, agent and eval design). Companion to SoloMock.",
    highlights: [
      "Authored 69 lessons across 16 phases from foundations through DP, system design, AI-era interview rounds (2024–2026 formats), AI-product engineering, frontend, and behavioral",
      "Built quiz-gated progression with star ratings, a mock interview timer with phase coaching, and a problem tracker that persists to localStorage",
      "Single-file HTML + JS + Tailwind (CDN), hash-based router, no build step — deployed on Vercel as a static asset",
    ],
    tags: ["HTML", "JavaScript", "Tailwind CSS", "Vercel"],
    github: "https://github.com/tonyx1998/swe-interview-guide",
    live: "https://swe-interview-guide.vercel.app",
    featured: false,
    className: "lg:col-span-1",
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
  },
];
