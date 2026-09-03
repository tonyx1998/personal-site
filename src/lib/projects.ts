import projectsData from "./projects.data.json";

// Resume-only presentation for the curated subset that appears on the PDF résumé.
// Site-facing metadata (live URL, github, date) is sourced from the parent Project
// so it can never drift; only the ATS-tuned bullets/stack/title live here.
export type ResumeMeta = {
  order: number;
  bullets: string[];
  stack: string;
  title?: string;
  date?: string;
  linksOverride?: string;
};

export type Project = {
  title: string;
  description: string;
  highlights?: string[];
  tags: string[];
  github: string | null;
  live: string | null;
  featured: boolean;
  hidden?: boolean;
  className: string;
  datePublished?: string;
  dateModified?: string;
  resume?: ResumeMeta;
};

// Single source of truth: src/lib/projects.data.json. Edit the JSON (or run the
// /update-portfolio command) — the site, the sitemap, and build-resume.py all
// read from it, so there is exactly one place a project's facts live.
export const projects: Project[] = (projectsData as Project[]).filter(
  (project) => !project.hidden
);

// URL slug derived from the title (no slug field in the data) — used by the
// per-project detail pages /projects/<slug>, the cards, the sitemap and JSON-LD.
export const projectSlug = (p: Project) =>
  p.title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const projectBySlug = (slug: string): Project | null =>
  projects.find((p) => projectSlug(p) === slug) ?? null;
