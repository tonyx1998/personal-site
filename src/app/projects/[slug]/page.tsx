import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import { ProjectLinks } from "@/components/ProjectLinks";
import chrome from "@/components/Chrome.module.css";
import {
  projects,
  projectSlug,
  projectBySlug,
  projectArticlePath,
  type StudyFigure,
} from "@/lib/projects";
import { projectVisual } from "@/lib/project-visuals";
import { jsonLdScriptProps } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";
import SectionContents from "./SectionContents";
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
  const title = project.seo?.title ?? project.title;
  const description =
    project.seo?.description ?? shortDescription(project.description);
  const figure = project.caseStudy?.sections.find(
    (section) => section.figure
  )?.figure;
  const shareImage =
    project.seo && figure
      ? {
          url: figure.src,
          width: figure.width,
          height: figure.height,
          alt: figure.alt,
        }
      : undefined;
  return {
    title,
    description,
    keywords: project.tags,
    alternates: { canonical: url },
    openGraph: {
      title: title + " · To Yin Yu",
      description,
      url,
      type: "article",
      ...(shareImage ? { images: [shareImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(shareImage ? { images: [shareImage] } : {}),
    },
  };
}

function StudyImage({ figure }: { figure: StudyFigure }) {
  return (
    <figure className={styles.figure}>
      <Image
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        sizes="(max-width: 56rem) calc(100vw - 40px), (max-width: 72rem) 68vw, 800px"
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
  const articlePath = projectArticlePath(project);
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
    description: project.seo?.description ?? project.description,
    url,
    keywords: project.tags.join(", "),
    author: {
      "@type": "Person",
      "@id": personId,
      name: "To Yin Yu",
      url: SITE_URL,
    },
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
              All projects
            </Link>
            <header className={styles.hero}>
              <div>
                <h1>{project.seo?.title ?? project.title}</h1>
                <p className={styles.lead}>
                  {study?.summary ?? project.description}
                </p>
              </div>
              <div className={styles.facts}>
                <dl className={styles.overview}>
                  {study ? (
                    <>
                      <div>
                        <dt>My role</dt>
                        <dd>{study.role}</dd>
                      </div>
                      <div>
                        <dt>Context</dt>
                        <dd>{study.context}</dd>
                      </div>
                    </>
                  ) : (
                    <div>
                      <dt>Year</dt>
                      <dd>{project.datePublished ?? "Ongoing"}</dd>
                    </div>
                  )}
                  {!project.live && (
                    <div>
                      <dt>Format</dt>
                      <dd>Local tool</dd>
                    </div>
                  )}
                  <div>
                    <dt>Built with</dt>
                    <dd>{project.tags.join(", ")}</dd>
                  </div>
                </dl>
                <ProjectLinks project={project} showNotes={false} />
              </div>
            </header>

            {study ? (
              <>
                <section
                  aria-labelledby="decisions-heading"
                  className={styles.decisions}
                >
                  <h2 id="decisions-heading">Engineering decisions</h2>
                  <dl className={styles.takeaways}>
                    <div>
                      <dt>Problem</dt>
                      <dd>{study.takeaways.problem}</dd>
                    </div>
                    <div>
                      <dt>Decision</dt>
                      <dd>{study.takeaways.decision}</dd>
                    </div>
                    {study.takeaways.tradeoff && (
                      <div>
                        <dt>Tradeoff</dt>
                        <dd>{study.takeaways.tradeoff}</dd>
                      </div>
                    )}
                    <div>
                      <dt>Verified behavior</dt>
                      <dd>{study.takeaways.verifiedBehavior}</dd>
                    </div>
                  </dl>
                </section>
                <div className={styles.reading}>
                  <SectionContents
                    sections={study.sections}
                    prefix="study-section"
                  />
                  <div className={styles.body}>
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
                        {section.figure && (
                          <StudyImage figure={section.figure} />
                        )}
                      </section>
                    ))}
                    <p className={styles.evidenceNote}>{study.evidenceNote}</p>
                    {project.engineeringArticle && articlePath && (
                      <aside
                        className={styles.related}
                        aria-label="Related engineering article"
                      >
                        <Link href={articlePath}>
                          {project.engineeringArticle.title}
                        </Link>
                      </aside>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {visual && (
                  <figure className={styles.projectImage}>
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      width={1280}
                      height={720}
                      sizes="(max-width: 56rem) calc(100vw - 40px), 800px"
                    />
                  </figure>
                )}
                {!!project.highlights?.length && (
                  <section
                    className={styles.notes}
                    aria-labelledby="notes-heading"
                  >
                    <h2 id="notes-heading">Project notes</h2>
                    <ul>
                      {project.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}

            <nav className={styles.pager} aria-label="More projects">
              {previous && (
                <Link href={"/projects/" + projectSlug(previous)}>
                  <span>Previous {study ? "case study" : "project"}</span>
                  <b>{previous.title}</b>
                </Link>
              )}
              <Link
                href={next ? "/projects/" + projectSlug(next) : "/projects"}
                className={styles.pagerNext}
              >
                <span>
                  {next
                    ? `Next ${study ? "case study" : "project"}`
                    : "Project index"}
                </span>
                <b>{next?.title ?? "All projects"}</b>
              </Link>
            </nav>
          </article>
        </main>
        <PortfolioFooter />
      </div>
    </>
  );
}
