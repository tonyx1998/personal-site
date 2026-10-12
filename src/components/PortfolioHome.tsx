import Link from "next/link";
import Exhibition from "./Exhibition";
import { PortfolioFooter } from "./PortfolioChrome";
import {
  selectedProjects,
  shortTitle,
  homepageSupportingProjects,
  projectSlug,
} from "@/lib/projects";
import styles from "./Exhibition.module.css";

export default function PortfolioHome() {
  const projects = ["SoloMock", "Gasolytics", "Amex Roofing"].map(
    (title) =>
      selectedProjects.find((project) => shortTitle(project) === title)!
  );
  return (
    <div className={styles.page}>
      <main>
        <Exhibition projects={projects} />
        <div aria-label="Background">
          <section
            className={styles.backgroundWork}
            aria-labelledby="background-work-heading"
          >
            <h2 id="background-work-heading">
              Software developer building useful web products.
            </h2>
            <p className={styles.contextLead}>
              I build full-stack apps, realtime voice tools, and booking systems
              for service businesses. My work covers the interface, backend,
              deployment, and the behavior users see when something goes wrong.
            </p>
            <div className={styles.contextLead}>
              <p>Open to software engineering roles</p>
              <p>Seattle area · Open to relocation</p>
            </div>
            <p className={styles.contextLead}>
              B.S. Computer Science, University of Maryland · US citizen
            </p>
            {projects.map((project) => (
              <article key={projectSlug(project)}>
                <h3>
                  <a href={"/projects/" + projectSlug(project)}>
                    {shortTitle(project)}
                  </a>
                </h3>
                <p>{project.homepageSummary ?? project.description}</p>
                <p>{project.contribution ?? project.highlights?.[0]}</p>
                <p>{project.tags.slice(0, 3).join(" · ")}</p>
                <p>
                  {
                    project.caseStudy?.sections.find(
                      (section) => section.figure
                    )?.figure?.caption
                  }
                </p>
              </article>
            ))}
            <h2 id="more">More work</h2>
            <p>Other products I build and maintain.</p>
            {homepageSupportingProjects.map((project) => (
              <article key={projectSlug(project)}>
                <h3>
                  <a href={"/projects/" + projectSlug(project)}>
                    {shortTitle(project)}
                  </a>
                </h3>
                <p>{project.homepageSummary ?? project.description}</p>
                <a href={"/projects/" + projectSlug(project)}>Project notes</a>
              </article>
            ))}
            <p>
              <Link href="/projects">All projects</Link>
            </p>
          </section>
          <section
            className={styles.about}
            id="about"
            aria-labelledby="about-heading"
          >
            <div>
              <h2 id="about-heading">About</h2>
              <p>
                I’m To Yin Yu, a software developer in Lynnwood, Washington. I
                finished my computer science degree at the University of
                Maryland in December 2022 and have been building and shipping my
                own products since 2024.
              </p>
              <p>
                I work across the frontend, backend, and deployment. The part
                after launch matters to me, too: tracing a failed request,
                making an error understandable, and deciding what a system
                should do when a dependency is unavailable.
              </p>
              <p>
                The case studies here explain those decisions, including the
                limits of what I have tested. I’m looking for a software
                engineering role where I can contribute that experience and
                learn from a team.
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
        </div>
      </main>
      <div className={styles.contact}>
        <PortfolioFooter />
      </div>
    </div>
  );
}
