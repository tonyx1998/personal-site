import Link from "next/link";
import { type Project, projectSlug } from "@/lib/projects";
import styles from "./ProjectLinks.module.css";

export function ProjectLinks({
  project,
  showNotes = true,
}: {
  project: Project;
  showNotes?: boolean;
}) {
  if (!showNotes && !project.live && !project.github) return null;

  return (
    <div className={styles.links}>
      {showNotes && (
        <Link
          href={"/projects/" + projectSlug(project)}
          aria-label={`${project.caseStudy ? "Case study" : "Project notes"}: ${project.title}`}
        >
          {project.caseStudy ? "Case study" : "Project notes"}
        </Link>
      )}
      {project.live && (
        <a href={project.live} aria-label={`Live product: ${project.title}`}>
          Live product
        </a>
      )}
      {project.github && (
        <a href={project.github} aria-label={`Source: ${project.title}`}>
          Source
        </a>
      )}
    </div>
  );
}
