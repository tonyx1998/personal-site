import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import portfolioStyles from "@/components/PortfolioHome.module.css";
import { projects, projectSlug, projectBySlug } from "@/lib/projects";
import { projectVisuals } from "@/lib/project-visuals";
import { jsonLdScriptProps } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";
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

  const index = projects.findIndex(
    (candidate) => projectSlug(candidate) === slug
  );
  const previousProject = index > 0 ? projects[index - 1] : null;
  const nextProject = index < projects.length - 1 ? projects[index + 1] : null;
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Projects",
        item: `${SITE_URL}/projects`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: project.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script {...jsonLdScriptProps(creativeWork)} />
      <script {...jsonLdScriptProps(breadcrumb)} />

      <div className={portfolioStyles.page}>
        <PortfolioHeader />

        <main className={styles.main}>
          <article className={styles.container}>
            <Link href="/projects" className={styles.backLink}>
              <ArrowLeft size={14} />
              Project archive
            </Link>

            <header className={styles.hero}>
              <p className={styles.projectIndex}>
                Project {String(index + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </p>

              <div className={styles.heroCopy}>
                <h1>{project.title}</h1>
                <p>{project.description}</p>

                <div className={styles.actions}>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.primaryLink}
                    >
                      Open live site <ArrowUpRight size={15} />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View source <ArrowUpRight size={15} />
                    </a>
                  )}
                </div>
              </div>
            </header>

            {visual && project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroImage}
                aria-label={`Open the live ${project.title} site`}
              >
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  fill
                  priority
                  sizes="(max-width: 1320px) calc(100vw - 48px), 1280px"
                />
              </a>
            )}

            <div className={styles.bodyGrid}>
              <section className={styles.buildSection}>
                <p className={styles.sectionLabel}>What I built</p>
                {project.highlights && project.highlights.length > 0 ? (
                  <ol>
                    {project.highlights.map((highlight, highlightIndex) => (
                      <li key={highlight}>
                        <span>
                          {String(highlightIndex + 1).padStart(2, "0")}
                        </span>
                        <p>{highlight}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className={styles.emptyNote}>
                    Designed, built, and shipped as an independent software
                    project.
                  </p>
                )}
              </section>

              <aside className={styles.facts} aria-label="Project details">
                <p className={styles.sectionLabel}>Project details</p>
                <dl>
                  <div>
                    <dt>Year</dt>
                    <dd>{project.datePublished ?? "Ongoing"}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{project.live ? "Live" : "Archived"}</dd>
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
                        <span>
                          <Lock size={11} aria-hidden="true" />
                          Private
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className={styles.stack}>
                  <p>Stack</p>
                  <div>
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            <nav className={styles.projectNav} aria-label="More projects">
              {previousProject ? (
                <Link href={`/projects/${projectSlug(previousProject)}`}>
                  <span>Previous</span>
                  {previousProject.title}
                </Link>
              ) : (
                <span />
              )}
              {nextProject ? (
                <Link href={`/projects/${projectSlug(nextProject)}`}>
                  <span>Next</span>
                  {nextProject.title}
                </Link>
              ) : (
                <Link href="/projects">
                  <span>Next</span>
                  Project archive
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
