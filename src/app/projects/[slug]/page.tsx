import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import chrome from "@/components/Chrome.module.css";
import {
  displayUrl,
  projects,
  projectSlug,
  projectBySlug,
  shortTitle,
} from "@/lib/projects";
import { projectVisuals } from "@/lib/project-visuals";
import { jsonLdScriptProps } from "@/lib/structured-data";
import { formatDate, LINKS_CHECKED_ON, SITE_URL } from "@/lib/site";
import styles from "./ProjectDetail.module.css";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: projectSlug(project) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  const url = `/projects/${slug}`;
  const description = shortDescription(project.description);

  return {
    title: project.title,
    description,
    keywords: project.tags,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} · To Yin Yu`,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
  };
}

// Search engines cut descriptions at roughly 155 characters. Cut at a word
// boundary so the snippet does not end mid-word.
function shortDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : max - 1).replace(/[,;:]$/, "")}…`;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  // Previous and next stay inside the same tier, so a product never pages
  // into the supporting list and back.
  const tier = projects.filter((p) => p.featured === project.featured);
  const index = tier.findIndex((candidate) => projectSlug(candidate) === slug);
  const previousProject = index > 0 ? tier[index - 1] : null;
  const nextProject = index < tier.length - 1 ? tier[index + 1] : null;
  const visual = projectVisuals[slug];

  const personId = `${SITE_URL}/#person`;
  const url = `${SITE_URL}/projects/${slug}`;
  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url,
    keywords: project.tags.join(", "),
    author: { "@id": personId },
    ...(project.github ? { codeRepository: project.github } : {}),
    ...(project.live ? { sameAs: project.live } : {}),
    ...(project.datePublished ? { datePublished: project.datePublished } : {}),
    ...(project.dateModified ? { dateModified: project.dateModified } : {}),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${SITE_URL}/projects`,
      },
      { "@type": "ListItem", position: 3, name: project.title, item: url },
    ],
  };

  return (
    <>
      <script {...jsonLdScriptProps(creativeWork)} />
      <script {...jsonLdScriptProps(breadcrumb)} />

      <div className={chrome.page}>
        <PortfolioHeader />

        <main className={`${chrome.container} ${styles.main}`}>
          <article>
            <Link href="/projects" className={styles.back}>
              ← All projects
            </Link>

            <header className={styles.hero}>
              <h1>{project.title}</h1>
              <p>{project.description}</p>
              <div className={styles.actions}>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open {displayUrl(project.live)}
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source on GitHub
                  </a>
                )}
              </div>
            </header>

            {visual && project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.screen}
                aria-label={`Open ${shortTitle(project)} in a new tab`}
              >
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  width={1280}
                  height={720}
                  priority
                  sizes="(max-width: 1240px) 100vw, 1140px"
                />
              </a>
            )}

            <div className={styles.body}>
              <section aria-labelledby="built-heading">
                <h2 id="built-heading" className={styles.label}>
                  What I built
                </h2>
                {project.highlights && project.highlights.length > 0 ? (
                  <ul className={styles.built}>
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Designed, built, and shipped as an independent project.</p>
                )}
              </section>

              <aside aria-labelledby="details-heading">
                <h2 id="details-heading" className={styles.label}>
                  Details
                </h2>
                <dl className={styles.facts}>
                  <div>
                    <dt>Year</dt>
                    <dd>{project.datePublished ?? "Ongoing"}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      {project.live
                        ? `Live, checked ${formatDate(LINKS_CHECKED_ON)}`
                        : "Archived"}
                    </dd>
                  </div>
                  <div>
                    <dt>Source</dt>
                    <dd>
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Public repository
                        </a>
                      ) : (
                        "Private repository"
                      )}
                    </dd>
                  </div>
                </dl>
                <ul className={styles.tags} aria-label="Stack">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </aside>
            </div>

            <nav className={styles.pager} aria-label="More projects">
              {previousProject ? (
                <Link href={`/projects/${projectSlug(previousProject)}`}>
                  <span>Previous</span>
                  <b>{previousProject.title}</b>
                </Link>
              ) : (
                <span />
              )}
              {nextProject ? (
                <Link
                  href={`/projects/${projectSlug(nextProject)}`}
                  className={styles.pagerNext}
                >
                  <span>Next</span>
                  <b>{nextProject.title}</b>
                </Link>
              ) : (
                <Link href="/projects" className={styles.pagerNext}>
                  <span>Next</span>
                  <b>All projects</b>
                </Link>
              )}
            </nav>
          </article>
        </main>

        <PortfolioFooter />
      </div>
    </>
  );
}
