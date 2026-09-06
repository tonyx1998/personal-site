import Image from "next/image";
import Link from "next/link";
import { ProjectLinks } from "./ProjectLinks";
import {
  projectSlug,
  selectedProjects,
  supportingProjects,
} from "@/lib/projects";
import { projectVisual } from "@/lib/project-visuals";
import chrome from "./Chrome.module.css";
import styles from "./ProjectsAll.module.css";

export default function ProjectsAll() {
  return (
    <div className={chrome.container}>
      <header className={styles.intro}>
        <h1>All projects</h1>
        <p>
          Client work, independent products, local tools, and technical courses.
          Start with a case study or browse the shorter project notes.
        </p>
        <nav className={styles.sectionLinks} aria-label="Project sections">
          <a href="#selected-heading">Selected work</a>
          <a href="#supporting-heading">More work</a>
        </nav>
      </header>

      <section aria-labelledby="selected-heading" className={styles.section}>
        <h2 id="selected-heading" className={styles.sectionTitle}>
          Selected work
        </h2>
        <div className={styles.rows}>
          {selectedProjects.map((project, index) => {
            const slug = projectSlug(project);
            const visual = projectVisual(project, slug);
            return (
              <article key={slug} className={styles.row}>
                {visual && (
                  <Link
                    href={"/projects/" + slug}
                    className={styles.thumb}
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <Image
                      src={visual.src}
                      alt=""
                      width={1280}
                      height={720}
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 600px) 96px, 224px"
                    />
                  </Link>
                )}
                <div className={styles.rowCopy}>
                  <h3>
                    <Link href={"/projects/" + slug}>{project.title}</Link>
                  </h3>
                  <p className={styles.desc}>
                    {project.homepageSummary ?? project.description}
                  </p>
                  <p className={styles.meta}>
                    {project.datePublished} ·{" "}
                    {project.tags.slice(0, 3).join(" · ")}
                  </p>
                  <ProjectLinks project={project} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="supporting-heading" className={styles.section}>
        <h2 id="supporting-heading" className={styles.sectionTitle}>
          More work
        </h2>
        <div className={styles.rows}>
          {supportingProjects.map((project) => {
            const slug = projectSlug(project);
            return (
              <article key={slug} className={styles.compactRow}>
                <div className={styles.rowCopy}>
                  <h3>
                    <Link href={"/projects/" + slug}>{project.title}</Link>
                  </h3>
                  <p className={styles.desc}>{project.description}</p>
                  <p className={styles.meta}>
                    {project.datePublished}
                    {!project.live && " · Local tool"} ·{" "}
                    {project.tags.slice(0, 3).join(" · ")}
                  </p>
                </div>
                <div className={styles.compactLinks}>
                  <ProjectLinks project={project} />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
