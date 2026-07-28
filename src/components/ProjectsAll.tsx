import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, projectSlug } from "@/lib/projects";
import { projectVisuals } from "@/lib/project-visuals";
import styles from "./ProjectsAll.module.css";

export default function ProjectsAll() {
  return (
    <section className={styles.archive}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={14} />
          Back home
        </Link>

        <header className={styles.intro}>
          <p className={styles.indexLabel}>
            Projects / {String(projects.length).padStart(2, "0")}
          </p>
          <div>
            <h1>Built, shipped, maintained.</h1>
            <p>
              A running archive of products, developer tools, public-data
              systems, and technical learning work.
            </p>
          </div>
        </header>

        <div className={styles.projectList}>
          {projects.map((project, index) => {
            const slug = projectSlug(project);
            const visual = projectVisuals[slug];

            return (
              <article key={project.title} className={styles.projectRow}>
                <div className={styles.projectIndex}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.datePublished ?? "Ongoing"}</span>
                </div>

                <div className={styles.projectCopy}>
                  <p className={styles.projectType}>
                    {project.featured ? "Selected work" : "Project archive"}
                  </p>
                  <h2>
                    <Link href={`/projects/${slug}`}>{project.title}</Link>
                  </h2>
                  <p className={styles.description}>{project.description}</p>

                  <div className={styles.tags} aria-label="Technologies">
                    {project.tags.slice(0, 6).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className={styles.links}>
                    <Link href={`/projects/${slug}`}>
                      Read project notes <ArrowUpRight size={14} />
                    </Link>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open live site <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {visual && project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectImage}
                    aria-label={`Open the live ${project.title} site`}
                  >
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      fill
                      sizes="(max-width: 860px) 100vw, 36vw"
                    />
                  </a>
                ) : (
                  <div className={styles.buildNote}>
                    <p>Build note</p>
                    <span>
                      {project.highlights?.[0] ??
                        "Designed, built, and shipped as an independent software project."}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
