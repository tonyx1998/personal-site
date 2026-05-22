"use client";

import { motion } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { ExternalLink, Star, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function ProjectCard({
  project,
  index,
  className,
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  const linkHref = project.live ?? project.github ?? "#";
  const linkKind = project.live ? "live site" : project.github ? "GitHub repo" : "details";

  return (
    <motion.a
      ref={ref}
      href={linkHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.title} ${linkKind}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "group relative overflow-hidden p-6 rounded-xl border border-border bg-card flex flex-col gap-4 transition-colors duration-300 cursor-pointer",
        "hover:border-accent/50",
        className,
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
        {project.highlights && project.highlights.length > 0 && (
          <>
            <p className="mt-3 text-xs font-mono uppercase tracking-wide text-accent">
              Highlights
            </p>
            <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground leading-relaxed">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent mt-0.5">▹</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </>
        )}
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
