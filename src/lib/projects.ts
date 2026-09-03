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

// Single source of truth: src/lib/projects.data.json. Edit the JSON, then run
// `make resume`. The site, the sitemap, the JSON-LD, and build-resume.py all
// read from it, so there is exactly one place a project's facts live.
//
// Order matters: featured entries come first in the JSON, in the order they
// should appear on the homepage and at the top of the archive. Supporting
// entries follow in their archive order.
export const projects: Project[] = (projectsData as Project[]).filter(
  (project) => !project.hidden
);

/** The products shown at full size on the homepage and the top of the archive. */
export const selectedProjects: Project[] = projects.filter((p) => p.featured);

/** Everything else: client work, tools, and the technical guides. */
export const supportingProjects: Project[] = projects.filter(
  (p) => !p.featured
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

/** "gasolytics.com" from "https://www.gasolytics.com/", for link labels. */
export const displayUrl = (url: string) =>
  url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

/** Short display title: the part before an em dash, e.g. "Gasolytics". */
export const shortTitle = (p: Project) => p.title.split(" — ")[0];
