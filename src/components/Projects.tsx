"use client";

import { motion } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { ExternalLink, Star, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

type Project = {
  title: string;
  description: string;
  tags: string[];
  github: string | null;
  live: string | null;
  featured: boolean;
  className: string;
};

const projects: Project[] = [
  {
    title: "SmartUrl",
    description:
      "URL shortening platform with QR code & barcode generation, click/scan analytics, Redis-based caching and rate limiting, and automatic page title extraction.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    github: "https://github.com/tonyx1998/SmartUrlServices",
    live: null,
    featured: true,
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "United Front Roofing",
    description:
      "Full marketing site for a local roofing business — AI chatbot, multi-step quote estimator, booking calendar, and SEO landing pages. Deployed on Netlify.",
    tags: ["Astro", "Tailwind CSS", "Netlify", "JavaScript"],
    github: null,
    live: "https://united-front-roofing.netlify.app",
    featured: false,
    className: "lg:col-span-1",
  },
  {
    title: "Obesity Data Analysis",
    description:
      "Data science project analyzing obesity patterns using Python. Visualized trends with matplotlib and seaborn, and built predictive models with sklearn and statsmodels.",
    tags: ["Python", "Pandas", "NumPy", "sklearn", "matplotlib"],
    github: null,
    live: "https://tonyx1998.github.io",
    featured: false,
    className: "lg:col-span-1",
  },
  {
    title: "Personal Portfolio",
    description:
      "This site — a modern portfolio built with Next.js, TypeScript, Tailwind CSS v4, and Framer Motion. Features dark/light mode, smooth scroll animations, and a downloadable resume.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: null,
    live: "https://personal-site-liart-beta.vercel.app",
    featured: false,
    className: "lg:col-span-2",
  },
  {
    title: "Schedule Creator",
    description:
      "Java desktop application that helps students build conflict-free class schedules by modelling courses, time slots, and constraints.",
    tags: ["Java"],
    github: "https://github.com/tonyx1998/Schedule-Creator",
    live: null,
    featured: false,
    className: "lg:col-span-1",
  },
];

function BentoCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.a
      ref={ref}
      href={project.live ?? project.github ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "group relative overflow-hidden p-6 rounded-xl border border-border bg-card flex flex-col gap-4 transition-colors duration-300 cursor-pointer",
        "hover:border-accent/50",
        project.className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(600px circle at var(--x) var(--y), color-mix(in srgb, var(--accent) 14%, transparent), transparent 40%)",
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="p-2 rounded-lg bg-muted">
          <FolderOpen size={18} className="text-accent" />
        </div>
        <div className="flex items-center gap-2">
          {project.featured && (
            <span className="flex items-center gap-1 text-xs text-amber-500 font-mono">
              <Star size={12} fill="currentColor" />
              featured
            </span>
          )}
          {project.live ? (
            <ExternalLink
              size={15}
              className="text-muted-foreground group-hover:text-accent transition-colors"
            />
          ) : (
            <GithubIcon />
          )}
        </div>
      </div>

      <div className="relative">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="relative flex flex-wrap gap-1.5 mt-auto">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded font-mono bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-mono text-sm mb-2">03. projects</p>
          <h2 className="text-3xl sm:text-4xl font-bold">Things I&apos;ve Built</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A selection of projects I&apos;m proud of
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(220px,auto)] gap-6">
          {projects.map((project, i) => (
            <BentoCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
