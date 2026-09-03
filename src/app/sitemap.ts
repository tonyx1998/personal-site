import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { projects, projectSlug } from "@/lib/projects";

// The most recent edit to any project entry. Used for the home and archive
// pages, which list every project.
function latestModified(): Date {
  const dates = projects
    .map((p) => p.dateModified ?? p.datePublished)
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d));
  return dates.length
    ? new Date(Math.max(...dates.map((d) => d.getTime())))
    : new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteModified = latestModified();
  return [
    {
      url: SITE_URL,
      lastModified: siteModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: siteModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${projectSlug(p)}`,
      lastModified: new Date(p.dateModified ?? p.datePublished ?? siteModified),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
