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

const alphabeticalProjects = [...supportingProjects].sort((a, b) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base", numeric: true })
);

export default function ProjectsAll() {
  return (
    <div className={chrome.container}>
      <header className={styles.intro}>
        <h1>Project archive</h1>
        <nav aria-label="Archive sections" className={styles.contents}>
          <a href="#selected-heading">Case studies</a>
          <a href="#supporting-heading">Project index</a>
        </nav>
      </header>

      <section className={styles.section} aria-labelledby="selected-heading">
        <h2 id="selected-heading">Case studies</h2>
        <div className={styles.studies}>
          {selectedProjects.map((project) => {
            const slug = projectSlug(project);
            const visual = projectVisual(project, slug);
            return (
              <article key={slug} className={styles.study}>
                {visual && (
                  <Image
                    className={styles.thumb}
                    src={visual.src}
                    alt={visual.alt}
                    width={1280}
                    height={720}
                    sizes="(max-width: 42rem) calc(100vw - 40px), (max-width: 75rem) 30vw, 360px"
                  />
                )}
                <h3>
                  <Link href={"/projects/" + slug}>{project.title}</Link>
                </h3>
                <p>{project.homepageSummary ?? project.description}</p>
                <ProjectLinks project={project} />
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="supporting-heading">
        <h2 id="supporting-heading">Project index</h2>
        <ul className={styles.index}>
          {alphabeticalProjects.map((project) => {
            const slug = projectSlug(project);
            return (
              <li key={slug}>
                <div>
                  <h3>
                    <Link href={"/projects/" + slug}>{project.title}</Link>
                  </h3>
                  <p className={styles.meta}>
                    {project.datePublished}
                    {!project.live && " · Local tool"}
                  </p>
                </div>
                <p className={styles.description}>
                  {project.homepageSummary ?? project.description}
                </p>
                <ProjectLinks project={project} showNotes={false} />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
