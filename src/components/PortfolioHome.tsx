import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { PortfolioFooter, PortfolioHeader } from "./PortfolioChrome";
import { ProjectLinks } from "./ProjectLinks";
import {
  homepageSupportingProjects,
  projectSlug,
  selectedProjects,
  shortTitle,
} from "@/lib/projects";
import { projectVisual } from "@/lib/project-visuals";
import chrome from "./Chrome.module.css";
import styles from "./PortfolioHome.module.css";

export default function PortfolioHome() {
  return (
    <div className={chrome.page}>
      <PortfolioHeader />
      <main id="main-content" tabIndex={-1}>
        <section className={chrome.container + " " + styles.hero} id="top">
          <h1>Software developer building useful web products.</h1>
          <p className={styles.lead}>
            I build full-stack apps, realtime voice tools, and booking systems
            for service businesses. My work covers the interface, backend,
            deployment, and the behavior users see when something goes wrong.
          </p>
          <div className={styles.availability}>
            <p>Open to software engineering roles</p>
            <p>Seattle area · Open to relocation</p>
          </div>
          <p className={styles.credentials}>
            B.S. Computer Science, University of Maryland · US citizen
          </p>
          <div className={styles.heroActions}>
            <a href="#work" className={styles.primaryAction}>
              View selected work <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a href="/resume.pdf">Resume (PDF)</a>
            <a href="mailto:tonyx1998@gmail.com">Email me</a>
          </div>
        </section>

        <section
          className={chrome.container + " " + styles.selected}
          id="work"
          aria-labelledby="work-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="work-heading">Selected work</h2>
            <p>Client delivery, realtime interaction, and data systems.</p>
          </div>
          <div className={styles.products}>
            {selectedProjects.map((project, index) => {
              const slug = projectSlug(project);
              const visual = projectVisual(project, slug);
              const figure = project.caseStudy?.sections.find(
                (section) => section.figure
              )?.figure;
              return (
                <article
                  key={slug}
                  className={styles.product}
                  aria-labelledby={slug + "-title"}
                >
                  <div className={styles.productIntro}>
                    <h3 id={slug + "-title"}>
                      <Link href={"/projects/" + slug}>
                        {shortTitle(project)}
                      </Link>
                    </h3>
                    <p className={styles.what}>
                      {project.homepageSummary ?? project.description}
                    </p>
                  </div>
                  {visual && (
                    <figure className={styles.screen}>
                      <Link href={"/projects/" + slug} tabIndex={-1}>
                        <Image
                          src={visual.src}
                          alt={visual.alt}
                          width={1280}
                          height={720}
                          loading={index === 0 ? "eager" : "lazy"}
                          sizes="(max-width: 820px) calc(100vw - 40px), (max-width: 1180px) 52vw, 594px"
                        />
                      </Link>
                      {figure && <figcaption>{figure.caption}</figcaption>}
                    </figure>
                  )}
                  <div className={styles.proof}>
                    <p>{project.contribution ?? project.highlights?.[0]}</p>
                    <p className={styles.meta}>
                      {project.tags.slice(0, 3).join(" · ")}
                    </p>
                    <ProjectLinks project={project} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          className={chrome.container + " " + styles.more}
          id="more"
          aria-labelledby="more-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="more-heading">More work</h2>
            <p>Other products I build and maintain.</p>
          </div>
          <ul className={styles.compactList}>
            {homepageSupportingProjects.map((project) => {
              const slug = projectSlug(project);
              const visual = projectVisual(project, slug);
              return (
                <li key={slug} className={styles.compactRow}>
                  {visual && (
                    <Link
                      href={"/projects/" + slug}
                      className={styles.thumbnail}
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <Image
                        src={visual.src}
                        alt=""
                        width={1280}
                        height={720}
                        sizes="(max-width: 820px) 96px, 160px"
                      />
                    </Link>
                  )}
                  <div>
                    <h3>
                      <Link href={"/projects/" + slug}>
                        {shortTitle(project)}
                      </Link>
                    </h3>
                    <p>{project.homepageSummary ?? project.description}</p>
                    <Link
                      className={styles.notesLink}
                      href={"/projects/" + slug}
                    >
                      Project notes <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href="/projects" className={styles.archiveLink}>
            All projects <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>

        <section
          className={chrome.container + " " + styles.about}
          id="about"
          aria-labelledby="about-heading"
        >
          <div>
            <h2 id="about-heading">About</h2>
            <p>
              I’m To Yin Yu, a software developer in Lynnwood, Washington. I
              finished my computer science degree at the University of Maryland
              in December 2022 and have been building and shipping my own
              products since 2024.
            </p>
            <p>
              I work across the frontend, backend, and deployment. The part
              after launch matters to me, too: tracing a failed request, making
              an error understandable, and deciding what a system should do when
              a dependency is unavailable.
            </p>
            <p>
              The case studies here explain those decisions, including the
              limits of what I have tested. I’m looking for a software
              engineering role where I can contribute that experience and learn
              from a team.
            </p>
          </div>
          <dl className={styles.background}>
            <div>
              <dt>Experience</dt>
              <dd>Independent software developer, 2024–present</dd>
            </div>
            <div>
              <dt>Education</dt>
              <dd>
                B.S. Computer Science
                <br />
                University of Maryland, 2022
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>
                Lynnwood, WA, near Seattle
                <br />
                US citizen · Open to relocation
              </dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>English, Mandarin, Cantonese</dd>
            </div>
          </dl>
        </section>
      </main>
      <PortfolioFooter />
    </div>
  );
}
