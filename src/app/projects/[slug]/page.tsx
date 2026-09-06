import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import { ProjectLinks } from "@/components/ProjectLinks";
import chrome from "@/components/Chrome.module.css";
import {
  projects,
  projectSlug,
  projectBySlug,
  type StudyFigure,
} from "@/lib/projects";
import { projectVisual } from "@/lib/project-visuals";
import { jsonLdScriptProps } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";
import styles from "./ProjectDetail.module.css";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: projectSlug(project) }));
}

function shortDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (
    cut.slice(0, lastSpace > 80 ? lastSpace : max - 1).replace(/[,;:]$/, "") +
    "…"
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  const url = "/projects/" + slug;
  const description = shortDescription(project.description);
  return {
    title: project.title,
    description,
    keywords: project.tags,
    alternates: { canonical: url },
    openGraph: {
      title: project.title + " · To Yin Yu",
      description,
      url,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: project.title, description },
  };
}

function StudyImage({
  figure,
  eager = false,
}: {
  figure: StudyFigure;
  eager?: boolean;
}) {
  return (
    <figure className={styles.figure}>
      <Image
        src={figure.originalSrc ?? figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        loading={eager ? "eager" : "lazy"}
        sizes="(max-width: 1000px) calc(100vw - 40px), 960px"
      />
      <figcaption>
        {figure.caption}{" "}
        <a href={figure.originalSrc ?? figure.src}>View full-size image</a>
      </figcaption>
    </figure>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  const study = project.caseStudy;
  const firstFigure = study?.sections.find((section) => section.figure)?.figure;
  const visual = projectVisual(project, slug);
  const tier = projects.filter((p) => p.featured === project.featured);
  const index = tier.findIndex((candidate) => projectSlug(candidate) === slug);
  const previous = index > 0 ? tier[index - 1] : null;
  const next = index < tier.length - 1 ? tier[index + 1] : null;
  const personId = SITE_URL + "/#person";
  const url = SITE_URL + "/projects/" + slug;
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
        name: "All projects",
        item: SITE_URL + "/projects",
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
        <main
          id="main-content"
          tabIndex={-1}
          className={chrome.container + " " + styles.main}
        >
          <article>
            <Link href="/projects" className={styles.back}>
              <ArrowLeft size={16} aria-hidden="true" /> All projects
            </Link>
            <header className={styles.hero}>
              <h1>{project.title}</h1>
              <p className={styles.lead}>
                {study?.summary ?? project.description}
              </p>
              {study && <p className={styles.context}>{study.context}</p>}
              <dl className={styles.overview}>
                {study && (
                  <div>
                    <dt>My role</dt>
                    <dd>{study.role}</dd>
                  </div>
                )}
                <div>
                  <dt>Year</dt>
                  <dd>{project.datePublished ?? "Ongoing"}</dd>
                </div>
                {!project.live && (
                  <div>
                    <dt>Format</dt>
                    <dd>Local tool</dd>
                  </div>
                )}
              </dl>
              <ProjectLinks project={project} showNotes={false} />
              <p className={styles.stack}>{project.tags.join(" · ")}</p>
            </header>

            {firstFigure ? (
              <StudyImage figure={firstFigure} eager />
            ) : (
              visual && (
                <figure className={styles.figure}>
                  <Image
                    src={visual.src}
                    alt={visual.alt}
                    width={1280}
                    height={720}
                    loading="eager"
                    sizes="(max-width: 1000px) calc(100vw - 40px), 960px"
                  />
                </figure>
              )
            )}

            {study ? (
              <div className={styles.study}>
                {study.sections.map((section, sectionIndex) => (
                  <section
                    key={section.title}
                    className={styles.studySection}
                    aria-labelledby={"study-section-" + sectionIndex}
                  >
                    <div className={styles.prose}>
                      <h2 id={"study-section-" + sectionIndex}>
                        {section.title}
                      </h2>
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {section.figure &&
                      section.figure.src !== firstFigure?.src && (
                        <StudyImage figure={section.figure} />
                      )}
                  </section>
                ))}
                <p className={styles.evidenceNote}>{study.evidenceNote}</p>
              </div>
            ) : (
              <section className={styles.notes} aria-labelledby="notes-heading">
                <h2 id="notes-heading">Project notes</h2>
                {project.highlights?.length ? (
                  <ul>
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{project.description}</p>
                )}
              </section>
            )}

            <nav className={styles.pager} aria-label="More projects">
              {previous ? (
                <Link href={"/projects/" + projectSlug(previous)}>
                  <span>
                    <ArrowLeft size={15} aria-hidden="true" /> Previous{" "}
                    {study ? "case study" : "project"}
                  </span>
                  <b>{previous.title}</b>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={"/projects/" + projectSlug(next)}
                  className={styles.pagerNext}
                >
                  <span>
                    Next {study ? "case study" : "project"}{" "}
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                  <b>{next.title}</b>
                </Link>
              ) : (
                <Link href="/projects" className={styles.pagerNext}>
                  <span>
                    Keep exploring <ArrowRight size={15} aria-hidden="true" />
                  </span>
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
