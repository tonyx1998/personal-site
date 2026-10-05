import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { type Project, projectSlug } from "@/lib/projects";
import styles from "./ProjectLinks.module.css";

export function ProjectLinks({
  project,
  showNotes = true,
}: {
  project: Project;
  showNotes?: boolean;
}) {
  return (
    <div className={styles.links}>
      {showNotes && (
        <Link
          href={"/projects/" + projectSlug(project)}
          aria-label={`${project.caseStudy ? "Case study" : "Project notes"}: ${project.title}`}
        >
          {project.caseStudy ? "Case study" : "Project notes"}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
      {project.live && (
        <a href={project.live} aria-label={`Live product: ${project.title}`}>
          Live product <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
      {project.github && (
        <a href={project.github} aria-label={`Source: ${project.title}`}>
          Source <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
