import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import Exhibition from "./Exhibition";
import { PortfolioFooter } from "./PortfolioChrome";
import {
  selectedProjects,
  projects as publicProjects,
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
  const exhibitionProjects = [
    "SoloMock",
    "Gasolytics",
    "Amex Roofing",
    "How's My Job Fit?",
    "SoloYap",
    "Throughline",
    "Reachspan",
  ].map(
    (title) => publicProjects.find((project) => shortTitle(project) === title)!
  );
  return (
    <div className={styles.page}>
      <main>
        <Exhibition projects={exhibitionProjects} />
        <div aria-label="Background">
          <section
            className={styles.backgroundWork}
            aria-labelledby="background-work-heading"
          >
            <div className={styles.editorialHeader}>
              <h2 id="background-work-heading" className={styles.scopeWords}>
                <span>Interface.</span>
                <span>Backend.</span>
                <span>After launch.</span>
              </h2>
              <div className={styles.editorialIntro}>
                <p className={styles.noteLabel}>
                  Software developer building useful web products.
                </p>
                <p>
                  I build full-stack apps, realtime voice tools, and booking
                  systems for service businesses. My work covers the interface,
                  backend, deployment, and the behavior users see when something
                  goes wrong.
                </p>
                <div className={styles.availabilityLedger}>
                  <p>Open to software engineering roles</p>
                  <p>Seattle area · Open to relocation</p>
                  <p>
                    B.S. Computer Science, University of Maryland · US citizen
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.notesHeading}>
              <h2>Engineering notes</h2>
              <p>The decisions behind the previews.</p>
            </div>
            <div className={styles.notes}>
              {projects.map((project, index) => (
                <details
                  key={projectSlug(project)}
                  open={index === 0}
                  className={styles.note}
                >
                  <summary>
                    <h3>{shortTitle(project)}</h3>
                    <span>
                      {project.contribution ?? project.highlights?.[0]}
                    </span>
                    <Plus
                      className={styles.disclosureIcon}
                      size={26}
                      aria-hidden="true"
                    />
                  </summary>
                  <div className={styles.noteBody}>
                    <p>{project.homepageSummary ?? project.description}</p>
                    <p className={styles.noteLabel}>
                      {project.tags.slice(0, 3).join(" · ")}
                    </p>
                    <p className={styles.noteCaption}>
                      {
                        project.caseStudy?.sections.find(
                          (section) => section.figure
                        )?.figure?.caption
                      }
                    </p>
                    <Link href={"/projects/" + projectSlug(project)}>
                      Read the case study{" "}
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </details>
              ))}
            </div>
            <div className={styles.notesHeading}>
              <h2 id="more">More work</h2>
              <p>Other products I build and maintain.</p>
            </div>
            <div className={styles.notes}>
              {homepageSupportingProjects.map((project) => (
                <details key={projectSlug(project)} className={styles.note}>
                  <summary>
                    <h3>{shortTitle(project)}</h3>
                    <span>
                      {project.homepageSummary ?? project.description}
                    </span>
                    <Plus
                      className={styles.disclosureIcon}
                      size={26}
                      aria-hidden="true"
                    />
                  </summary>
                  <div className={styles.noteBody}>
                    <p>{project.contribution ?? project.highlights?.[0]}</p>
                    <Link href={"/projects/" + projectSlug(project)}>
                      Project notes{" "}
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </details>
              ))}
            </div>
            <p className={styles.allWork}>
              <Link href="/projects">
                All projects <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            </p>
          </section>
          <section
            className={styles.about}
            id="about"
            aria-labelledby="about-heading"
          >
            <div>
              <h2 id="about-heading">About</h2>
              <p className={styles.noteLabel}>
                To Yin Yu · Lynnwood, Washington
              </p>
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
