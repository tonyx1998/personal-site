import Image from "next/image";
import Link from "next/link";
import {
  displayUrl,
  projectSlug,
  selectedProjects,
  shortTitle,
  supportingProjects,
} from "@/lib/projects";
import { projectVisuals } from "@/lib/project-visuals";
import chrome from "./Chrome.module.css";
import styles from "./ProjectsAll.module.css";

export default function ProjectsAll() {
  return (
    <div className={chrome.container}>
      <header className={styles.intro}>
        <h1>Everything I have shipped</h1>
        <p>
          Products, tools, and courses, all live. The first seven are the ones
          to look at first. Each title opens my notes on what was built and why.
        </p>
      </header>

      <section aria-labelledby="selected-heading" className={styles.section}>
        <h2 id="selected-heading" className={styles.sectionTitle}>
          Products
        </h2>
        <div className={styles.rows}>
          {selectedProjects.map((project, index) => {
            const slug = projectSlug(project);
            const visual = projectVisuals[slug];

            return (
              <article key={project.title} className={styles.row}>
                {visual && (
                  <Link
                    href={`/projects/${slug}`}
                    className={styles.thumb}
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <Image
                      src={visual.src}
                      alt=""
                      width={1280}
                      height={720}
                      loading={index < 2 ? "eager" : "lazy"}
                      sizes="(max-width: 820px) 100vw, 360px"
                    />
                  </Link>
                )}
                <div className={styles.rowCopy}>
                  <h3>
                    <Link href={`/projects/${slug}`}>{project.title}</Link>
                  </h3>
                  <p className={styles.desc}>{project.description}</p>
                  <p className={styles.meta}>
                    <span>{project.datePublished}</span>
                    <span>{project.tags.slice(0, 5).join(" · ")}</span>
                  </p>
                  <div className={styles.links}>
                    <Link href={`/projects/${slug}`}>Project notes</Link>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {displayUrl(project.live)}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="supporting-heading" className={styles.section}>
        <h2 id="supporting-heading" className={styles.sectionTitle}>
          Smaller builds and courses
        </h2>
        <div className={styles.rows}>
          {supportingProjects.map((project) => {
            const slug = projectSlug(project);

            return (
              <article
                key={project.title}
                className={`${styles.row} ${styles.rowCompact}`}
              >
                <div className={styles.rowCopy}>
                  <h3>
                    <Link href={`/projects/${slug}`}>
                      {shortTitle(project)}
                    </Link>
                  </h3>
                  <p className={styles.desc}>{project.description}</p>
                  <p className={styles.meta}>
                    <span>{project.datePublished}</span>
                    <span>{project.tags.slice(0, 4).join(" · ")}</span>
                  </p>
                  <div className={styles.links}>
                    <Link href={`/projects/${slug}`}>Project notes</Link>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {displayUrl(project.live)}
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
