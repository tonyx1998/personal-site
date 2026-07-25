import { SITE_URL } from "./site";
import { projects, projectSlug } from "./projects";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "To Yin Yu",
  alternateName: "tonyx1998",
  url: SITE_URL,
  jobTitle: "Full-Stack Software Engineer",
  description:
    "Full-stack engineer building applied AI products with TypeScript, Python, Next.js, FastAPI, WebRTC, and the OpenAI Realtime API.",
  email: "mailto:tonyx1998@gmail.com",
  image: `${SITE_URL}/opengraph-image`,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Maryland, College Park",
  },
  knowsAbout: [
    "TypeScript",
    "Python",
    "Next.js",
    "React",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Docker",
    "WebRTC",
    "OpenAI Realtime API",
    "Applied AI",
    "Large Language Models",
    "Realtime Voice Agents",
  ],
  sameAs: [
    "https://github.com/tonyx1998",
    "https://www.linkedin.com/in/to-yin-yu/",
  ],
} as const;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: "To Yin Yu — Full-Stack Engineer & Applied AI Builder",
  description:
    "Portfolio of To Yin Yu — full-stack engineer shipping applied AI products with Next.js, FastAPI, WebRTC, and the OpenAI Realtime API.",
  inLanguage: "en",
  author: { "@id": PERSON_ID },
  publisher: { "@id": PERSON_ID },
} as const;

export const projectsCollectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/projects#page`,
  url: `${SITE_URL}/projects`,
  name: "Projects · To Yin Yu",
  description:
    "Every project To Yin Yu has shipped — full-stack apps, AI voice agents, data tools, and learning resources.",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": PERSON_ID },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p.title,
        description: p.description,
        keywords: p.tags.join(", "),
        author: { "@id": PERSON_ID },
        url: `${SITE_URL}/projects/${projectSlug(p)}`,
        ...(p.live ? { sameAs: p.live } : {}),
        ...(p.github ? { codeRepository: p.github } : {}),
        ...(p.datePublished ? { datePublished: p.datePublished } : {}),
        ...(p.dateModified ? { dateModified: p.dateModified } : {}),
      },
    })),
  },
} as const;

export function jsonLdScriptProps(data: unknown) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
  };
}
