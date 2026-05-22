export type Project = {
  title: string;
  description: string;
  highlights?: string[];
  tags: string[];
  github: string | null;
  live: string | null;
  featured: boolean;
  className: string;
};

export const projects: Project[] = [
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
    live: "https://solomock.vercel.app",
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
    title: "Obesity Data Analysis",
    description:
      "Data science project analyzing obesity patterns with matplotlib/seaborn visualizations and sklearn predictive models.",
    tags: ["Python", "Pandas", "NumPy", "sklearn", "matplotlib"],
    github: null,
    live: "https://tonyx1998.github.io",
    featured: false,
    className: "lg:col-span-1",
  },
];
