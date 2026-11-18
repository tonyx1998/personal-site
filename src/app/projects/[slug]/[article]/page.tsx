import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import chrome from "@/components/Chrome.module.css";
import {
  projects,
  projectSlug,
  projectBySlug,
  projectArticlePath,
  shortTitle,
} from "@/lib/projects";
import { jsonLdScriptProps } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";
import SectionContents from "../SectionContents";
import styles from "../ProjectDetail.module.css";
import articleStyles from "./Article.module.css";

type Props = { params: Promise<{ slug: string; article: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.flatMap((project) =>
    project.engineeringArticle
      ? [
          {
            slug: projectSlug(project),
            article: project.engineeringArticle.slug,
          },
        ]
      : []
  );
}

function getArticle(slug: string, articleSlug: string) {
  const project = projectBySlug(slug);
  const article = project?.engineeringArticle;
  if (!project || !article || article.slug !== articleSlug) notFound();
  return { project, article, path: projectArticlePath(project)! };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, article: articleSlug } = await params;
  const { article, path } = getArticle(slug, articleSlug);
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: path },
    openGraph: {
      title: article.title + " · To Yin Yu",
      description: article.description,
      url: path,
      type: "article",
      modifiedTime: article.dateModified,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function EngineeringArticlePage({ params }: Props) {
  const { slug, article: articleSlug } = await params;
  const { project, article, path } = getArticle(slug, articleSlug);
  const projectPath = "/projects/" + slug;
  const verifiedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(article.verifiedOn));
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: SITE_URL + path,
    mainEntityOfPage: SITE_URL + path,
    author: { "@id": SITE_URL + "/#person" },
    isPartOf: { "@type": "CreativeWork", url: SITE_URL + projectPath },
    dateModified: article.dateModified,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: project.title,
        item: SITE_URL + projectPath,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: SITE_URL + path,
      },
    ],
  };

  return (
    <>
      <script {...jsonLdScriptProps(articleJsonLd)} />
      <script {...jsonLdScriptProps(breadcrumb)} />
      <div className={chrome.page}>
        <PortfolioHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className={chrome.container + " " + styles.main}
        >
          <article>
            <Link href={projectPath} className={styles.back}>
              {shortTitle(project)} case study
            </Link>
            <header className={styles.hero}>
              <div>
                <h1>{article.title}</h1>
                <p className={styles.lead}>{article.introduction}</p>
              </div>
              <div className={styles.facts}>
                <dl className={styles.overview}>
                  {project.caseStudy && (
                    <div>
                      <dt>My role</dt>
                      <dd>{project.caseStudy.role}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Focus</dt>
                    <dd>{article.focus}</dd>
                  </div>
                  <div>
                    <dt>Recovery verified</dt>
                    <dd>
                      <time dateTime={article.verifiedOn}>{verifiedDate}</time>{" "}
                      · revision <code>{article.verifiedRevision}</code>
                    </dd>
                  </div>
                </dl>
              </div>
            </header>
            <div className={styles.reading}>
              <SectionContents
                sections={article.sections}
                prefix="article-section"
              />
              <div className={styles.body}>
                {article.sections.map((section, index) => (
                  <section
                    key={section.title}
                    className={styles.prose + " " + styles.studySection}
                    aria-labelledby={"article-section-" + index}
                  >
                    <h2 id={"article-section-" + index}>{section.title}</h2>
                    {section.blocks.map((block, blockIndex) =>
                      block.type === "paragraph" ? (
                        <p key={blockIndex}>{block.text}</p>
                      ) : (
                        <ul key={blockIndex} className={articleStyles.list}>
                          {block.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )
                    )}
                  </section>
                ))}
                <p className={styles.evidenceNote}>{article.evidenceNote}</p>
                <nav
                  className={articleStyles.links}
                  aria-label={`Continue exploring ${shortTitle(project)}`}
                >
                  <Link href={projectPath}>Back to the case study</Link>
                  {project.live && (
                    <a href={project.live}>Explore {shortTitle(project)}</a>
                  )}
                </nav>
              </div>
            </div>
          </article>
        </main>
        <PortfolioFooter />
      </div>
    </>
  );
}
