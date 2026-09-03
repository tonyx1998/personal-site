import Image from "next/image";
import Link from "next/link";
import { PortfolioFooter, PortfolioHeader } from "./PortfolioChrome";
import {
  displayUrl,
  projectSlug,
  selectedProjects,
  shortTitle,
  supportingProjects,
} from "@/lib/projects";
import { projectVisuals } from "@/lib/project-visuals";
import { formatDate, LINKS_CHECKED_ON } from "@/lib/site";
import chrome from "./Chrome.module.css";
import styles from "./PortfolioHome.module.css";

export default function PortfolioHome() {
  const checked = formatDate(LINKS_CHECKED_ON);

  return (
    <div className={chrome.page}>
      <PortfolioHeader />

      <main>
        <section className={`${chrome.container} ${styles.hero}`} id="top">
          <h1>I build software products on my own and keep them running.</h1>
          <p className={styles.lead}>
            Seven of them are live right now: a job-fit checker, two realtime
            voice apps, a gas-price map, two business sites with real booking
            flows, and a set of technical courses. Every screenshot below opens
            the real thing.
          </p>
          <ul className={styles.ask} aria-label="What I am looking for">
            <li className={styles.askMain}>
              Looking for my first full-time software engineering role
            </li>
            <li>Seattle area or remote</li>
            <li>US citizen</li>
            <li>B.S. Computer Science, University of Maryland</li>
          </ul>
        </section>

        <section
          className={`${chrome.container} ${styles.products}`}
          id="work"
          aria-label="Selected products"
        >
          {selectedProjects.map((project, index) => {
            const slug = projectSlug(project);
            const visual = projectVisuals[slug];
            const name = shortTitle(project);

            return (
              <article key={project.title} className={styles.product}>
                {visual && project.live && (
                  <div className={styles.screen}>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${name} in a new tab`}
                    >
                      <Image
                        src={visual.src}
                        alt={visual.alt}
                        width={1280}
                        height={720}
                        priority={index === 0}
                        sizes="(max-width: 1240px) 100vw, 1140px"
                      />
                      <span className={styles.open} aria-hidden="true">
                        Open {displayUrl(project.live)}
                      </span>
                    </a>
                  </div>
                )}

                <div className={styles.spec}>
                  <div>
                    <h2>
                      <Link href={`/projects/${slug}`}>{name}</Link>
                    </h2>
                    <p className={styles.what}>{project.description}</p>
                    <div className={styles.links}>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {displayUrl(project.live)}
                        </a>
                      )}
                      <Link href={`/projects/${slug}`}>Project notes</Link>
                    </div>
                    <p className={styles.meta}>
                      {project.live && (
                        <span className={styles.live}>
                          Live, checked {checked}
                        </span>
                      )}
                      <span>{project.datePublished}</span>
                      <span>{project.tags.slice(0, 5).join(" · ")}</span>
                    </p>
                  </div>
                  {project.highlights && (
                    <ul className={styles.facts}>
                      {project.highlights.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <section className={`${chrome.container} ${styles.more}`} id="more">
          <h2>Smaller builds and courses</h2>
          <p className={styles.moreLead}>
            Client work, tools, and the guides that make up Throughline. All
            live.{" "}
            <Link href="/projects" className={styles.moreLink}>
              See the full list with notes
            </Link>
          </p>
          <ul className={styles.list}>
            {supportingProjects.map((project) => {
              const slug = projectSlug(project);
              return (
                <li key={project.title}>
                  <Link href={`/projects/${slug}`} className={styles.listTitle}>
                    {shortTitle(project)}
                  </Link>
                  <span className={styles.listYear}>
                    {project.datePublished}
                  </span>
                  <span className={styles.listDesc}>{project.description}</span>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.listLink}
                    >
                      {displayUrl(project.live)}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className={`${chrome.container} ${styles.about}`} id="about">
          <div>
            <h2>About</h2>
            <p>
              I’m To Yin Yu, a software developer in Lynnwood, Washington. I
              finished my computer science degree at the University of Maryland
              in December 2022 and have been building and shipping my own
              products since 2024.
            </p>
            <p>
              I do the whole job: the product decision, the frontend, the
              backend, deployment, and the part after launch where things break.
              Most of my recent work puts language models in production, which
              means a lot of time spent on cost limits, evaluation, and failure
              handling.
            </p>
            <div className={styles.habits}>
              <h3>Habits, and the project each one came from</h3>
              <p>
                <b>Bound the cost before launch.</b> SoloMock and SoloYap mint
                short-lived keys, cap sessions at 15 minutes, and rate-limit by
                IP, so an open voice app cannot run up the OpenAI bill.
              </p>
              <p>
                <b>Fail loudly, not quietly.</b> Amex Roofing’s booking route
                refuses requests from unknown origins before it touches the
                calendar, and its calendar sync raises an alarm instead of
                dropping a booking.
              </p>
              <p>
                <b>Keep private data in the browser.</b> How’s My Job Fit?
                parses resumes on the user’s machine and stores nothing.
              </p>
            </div>
          </div>
          <dl className={styles.timeline}>
            <div>
              <dt>2024 to now</dt>
              <dd>Independent software developer, seven live products</dd>
            </div>
            <div>
              <dt>Dec 2022</dt>
              <dd>B.S. Computer Science, University of Maryland</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>
                Lynnwood, WA (Seattle area). US citizen. Open to relocation.
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
