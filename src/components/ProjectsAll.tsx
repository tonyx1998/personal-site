import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, projectSlug } from "@/lib/projects";
import { projectVisuals } from "@/lib/project-visuals";
import styles from "./ProjectsAll.module.css";

const selectedProjectOrder = [
  "Plugrade",
  "How's My Job Fit?",
  "SoloMock",
  "SoloYap",
  "Gasolytics — US Gas Price Map",
  "Throughline — Technical Learning Ecosystem",
];

export default function ProjectsAll() {
  const selectedProjects = projects
    .filter((project) => project.featured)
    .sort(
      (a, b) =>
        selectedProjectOrder.indexOf(a.title) -
        selectedProjectOrder.indexOf(b.title)
    );
  const supportingProjects = projects.filter((project) => !project.featured);

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
            <h1>Everything I have shipped.</h1>
            <p>
              Products, tools, and courses, all live. The first six are the ones
              to look at.
            </p>
          </div>
        </header>

        <div className={styles.projectList}>
          {selectedProjects.map((project, index) => {
            const slug = projectSlug(project);
            const visual = projectVisuals[slug];

            return (
              <article key={project.title} className={styles.projectRow}>
                <div className={styles.projectIndex}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.datePublished ?? "Ongoing"}</span>
                </div>

                <div className={styles.projectCopy}>
                  <p className={styles.projectType}>Selected work</p>
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
                      loading={index === 0 ? "eager" : "lazy"}
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

        <section
          className={styles.experiments}
          aria-labelledby="supporting-work-heading"
        >
          <header className={styles.experimentsHeader}>
            <p className={styles.indexLabel}>
              Supporting work /{" "}
              {String(supportingProjects.length).padStart(2, "0")}
            </p>
            <div>
              <h2 id="supporting-work-heading">Smaller builds and courses.</h2>
              <p>
                Client work, tools, and the technical guides that make up
                Throughline.
              </p>
            </div>
          </header>

          <div className={styles.compactList}>
            {supportingProjects.map((project, index) => {
              const slug = projectSlug(project);

              return (
                <article key={project.title} className={styles.compactRow}>
                  <div className={styles.compactMeta}>
                    <span>
                      {String(selectedProjects.length + index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>
                    <span>{project.datePublished ?? "Ongoing"}</span>
                  </div>

                  <div className={styles.compactCopy}>
                    <h3>
                      <Link href={`/projects/${slug}`}>{project.title}</Link>
                    </h3>
                    <p>{project.description}</p>
                  </div>

                  <div className={styles.compactTags} aria-label="Technologies">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className={styles.compactLinks}>
                    <Link href={`/projects/${slug}`}>
                      Notes <ArrowUpRight size={13} />
                    </Link>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
