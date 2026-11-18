import Image from "next/image";
import Link from "next/link";
import { PortfolioFooter, PortfolioHeader } from "./PortfolioChrome";
import { ProjectLinks } from "./ProjectLinks";
import { projectVisual } from "@/lib/project-visuals";
import {
  type Project,
  projectArticlePath,
  projectSlug,
  selectedProjects,
  shortTitle,
} from "@/lib/projects";
import chrome from "./Chrome.module.css";
import styles from "./PortfolioHome.module.css";

function ProjectStudy({
  project,
  lead = false,
}: {
  project: Project;
  lead?: boolean;
}) {
  const slug = projectSlug(project);
  const visual = projectVisual(project, slug);
  const articlePath = projectArticlePath(project);
  const Heading = lead ? "h2" : "h3";
  const figure = project.caseStudy?.sections.find(
    (section) => section.figure
  )?.figure;

  return (
    <article
      id={lead ? "work" : undefined}
      aria-labelledby={`title-${slug}`}
      className={lead ? styles.leadProject : styles.study}
    >
      {visual && (
        <figure className={styles.figure}>
          <div className={styles.screen}>
            <Image
              src={visual.src}
              alt={visual.alt}
              width={figure?.width ?? 1280}
              height={figure?.height ?? 720}
              loading={lead ? "eager" : "lazy"}
              fetchPriority={lead ? "high" : undefined}
              sizes={
                lead
                  ? "(max-width: 800px) 94vw, (max-width: 1180px) 54vw, 620px"
                  : "(max-width: 680px) 94vw, (max-width: 1180px) 45vw, 542px"
              }
            />
          </div>
          <figcaption>
            {project.resume?.relationship === "Client project" && (
              <>{project.resume.relationship} · </>
            )}
            {project.exhibition?.caption ?? figure?.caption}
          </figcaption>
        </figure>
      )}
      <div className={styles.studyCopy}>
        <Heading id={`title-${slug}`} className={styles.projectTitle}>
          <Link href={`/projects/${slug}`}>{shortTitle(project)}</Link>
        </Heading>
        <p className={styles.description}>
          {project.exhibition?.summary ??
            project.homepageSummary ??
            project.description}
        </p>
        <p className={styles.decision}>
          {lead
            ? project.contribution
            : (project.caseStudy?.takeaways.verifiedBehavior ??
              project.contribution)}
        </p>
        <ProjectLinks project={project} />
        {lead && articlePath && project.engineeringArticle && (
          <Link className={styles.incidentLink} href={articlePath}>
            {project.engineeringArticle.title}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function PortfolioHome() {
  const lead =
    selectedProjects.find(
      (project) => projectSlug(project) === "gasolytics-us-gas-price-map"
    ) ?? selectedProjects[0];
  const otherStudies = selectedProjects.filter((project) => project !== lead);

  return (
    <div className={chrome.page} id="top">
      <PortfolioHeader />
      <main className={chrome.container} id="main-content" tabIndex={-1}>
        <div className={styles.opening}>
          <header className={styles.intro}>
            <h1>To Yin Yu</h1>
            <p className={styles.role}>Software developer near Seattle.</p>
            <p className={styles.lede}>
              I build fuel-price maps and voice tools for interview practice. I
              care about what people can still do when a data feed falls behind
              or a call drops.
            </p>
            <div className={styles.actions}>
              <a className={styles.resume} href="/resume.pdf">
                View résumé <span>(PDF)</span>
              </a>
              <a className={styles.contactLink} href="#contact">
                Get in touch
              </a>
            </div>
          </header>
          {lead && <ProjectStudy project={lead} lead />}
        </div>

        <section className={styles.moreWork} aria-labelledby="more">
          <div className={styles.sectionHeading}>
            <h2 id="more">More case studies</h2>
            <Link href="/projects" className={styles.archiveLink}>
              All projects
            </Link>
          </div>
          <div className={styles.pair}>
            {otherStudies.map((project) => (
              <ProjectStudy key={projectSlug(project)} project={project} />
            ))}
          </div>
        </section>

        <section
          className={styles.about}
          id="about"
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading">About me</h2>
          <div className={styles.bio}>
            <p>
              I’m based in Lynnwood, Washington, and have been building
              independent software since 2024.
            </p>
            <p>
              I work across the interface and backend. My favorite part is
              tracing a problem from what someone sees on screen back to the
              request or piece of data that caused it.
            </p>
            <dl className={styles.background}>
              <div>
                <dt>Education</dt>
                <dd>B.S. in Computer Science, University of Maryland, 2022</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>English, Mandarin and Cantonese</dd>
              </div>
              <div>
                <dt>Work authorization</dt>
                <dd>U.S. citizen</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
      <PortfolioFooter />
    </div>
  );
}
