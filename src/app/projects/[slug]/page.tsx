import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Lock, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { projects, projectSlug, projectBySlug } from "@/lib/projects";
import { jsonLdScriptProps } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: projectSlug(p) }));
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
  return {
    title: project.title,
    description: project.description,
    keywords: project.tags,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} · To Yin Yu`,
      description: project.description,
      url,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: project.title, description: project.description },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const PERSON_ID = `${SITE_URL}/#person`;
  const url = `${SITE_URL}/projects/${slug}`;
  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url,
    keywords: project.tags.join(", "),
    author: { "@id": PERSON_ID },
    ...(project.github ? { codeRepository: project.github } : {}),
    ...(project.live ? { sameAs: project.live } : {}),
    ...(project.datePublished ? { datePublished: project.datePublished } : {}),
    ...(project.dateModified ? { dateModified: project.dateModified } : {}),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Projects", item: `${SITE_URL}/projects` },
      { "@type": "ListItem", position: 2, name: project.title, item: url },
    ],
  };

  return (
    <>
      <script {...jsonLdScriptProps(creativeWork)} />
      <script {...jsonLdScriptProps(breadcrumb)} />
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <article className="max-w-2xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            All projects
          </Link>

          <div className="flex items-center gap-3 mb-3 text-xs font-mono text-muted-foreground">
            {project.datePublished && <span>{project.datePublished}</span>}
            {project.featured && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star size={12} fill="currentColor" />
                featured
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs rounded font-mono bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-background font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Visit live site
                <ExternalLink size={15} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border font-medium text-sm hover:border-accent/50 transition-colors"
              >
                View source
              </a>
            )}
            {!project.github && project.live && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 font-mono">
                <Lock size={11} aria-hidden="true" />
                Private repo · code available on request
              </span>
            )}
          </div>

          {project.highlights && project.highlights.length > 0 && (
            <section>
              <h2 className="text-xs font-mono uppercase tracking-wide text-accent mb-3">
                Highlights
              </h2>
              <ul className="space-y-3 text-muted-foreground leading-relaxed">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden="true" className="text-accent mt-1">
                      ▹
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
