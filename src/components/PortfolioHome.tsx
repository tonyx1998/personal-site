"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PortfolioFooter, PortfolioHeader } from "./PortfolioChrome";
import styles from "./PortfolioHome.module.css";

type PortfolioProject = {
  name: string;
  category: string;
  year: string;
  image: string;
  alt: string;
  problem: string;
  build: string;
  href: string;
  live: string;
};

const projects: PortfolioProject[] = [
  {
    name: "Plugrade",
    category: "Trust index",
    year: "2026",
    image: "/projects/plugrade.png",
    alt: "Plugrade home page explaining trust grades for Claude Code plugins",
    problem:
      "Claude Code plugins are pinned to a commit, but the code that runs is often fetched at launch.",
    build:
      "Line-by-line audits with file-and-line evidence, and a daily snapshot of 300+ plugins' install counts since July 2026.",
    href: "/projects/plugrade",
    live: "https://plugrade.dev",
  },
  {
    name: "How's My Job Fit?",
    category: "Job-fit reports",
    year: "2026",
    image: "/projects/howsmyjobfit.png",
    alt: "How's My Job Fit? workbench with a resume drop zone and report panel",
    problem:
      "Keyword match scores tell a candidate nothing about which requirements actually matter.",
    build:
      "Resumes parsed in the browser, a deterministic weighted fit model, and a report that separates eligibility from skills.",
    href: "/projects/hows-my-job-fit",
    live: "https://howsmyjobfit.com",
  },
  {
    name: "Gasolytics",
    category: "Data platform",
    year: "2026",
    image: "/projects/gasolytics.png",
    alt: "Gasolytics dashboard showing a United States fuel price map",
    problem: "U.S. fuel-price data is noisy, scattered, and hard to explore.",
    build:
      "Daily AAA averages from a snapshot feed, server-rendered d3-geo maps, state and metro pages, a trip calculator, and an EV comparison.",
    href: "/projects/gasolytics-us-gas-price-map",
    live: "https://www.gasolytics.com/",
  },
  {
    name: "SoloMock",
    category: "Developer tool",
    year: "2025",
    image: "/projects/solomock.png",
    alt: "SoloMock voice coding interview workspace",
    problem: "Practicing interviews alone lacks realism and structure.",
    build:
      "Realtime voice over WebRTC, editor snapshots streamed to the model, and 15 interviewer briefs with staged hints.",
    href: "/projects/solomock",
    live: "https://solomock.com",
  },
  {
    name: "SoloYap",
    category: "Voice tutor",
    year: "2025",
    image: "/projects/soloyap.png",
    alt: "SoloYap realtime English speaking tutor",
    problem: "Speaking practice without feedback is slow and unstructured.",
    build:
      "Realtime voice practice with instant corrections, guided scenarios, and CEFR-graded difficulty.",
    href: "/projects/soloyap",
    live: "https://soloyap.com",
  },
  {
    name: "Throughline",
    category: "Learning platform",
    year: "2026",
    image: "/projects/throughline.png",
    alt: "Throughline technical learning platform home page",
    problem: "Engineers jump between tutorials without a coherent path.",
    build:
      "A five-act learning system that connects guides, hands-on building, interview prep, and practice.",
    href: "/projects/throughline-technical-learning-ecosystem",
    live: "https://throughline.guide",
  },
];

const reelProjects = [
  projects[0],
  projects[1],
  projects[3],
  projects[4],
  projects[2],
  projects[5],
];

export default function PortfolioHome() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const activeProject = reelProjects[activeIndex];

  useEffect(() => {
    if (reduceMotion || isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % reelProjects.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [isPaused, reduceMotion]);

  return (
    <div className={styles.page}>
      <PortfolioHeader />

      <main>
        <section className={`${styles.container} ${styles.hero}`} id="top">
          <motion.div
            className={styles.intro}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className={styles.eyebrow}>Software developer · Lynnwood, WA</p>
            <h1>I build products on my own and keep them running.</h1>
            <p className={styles.introCopy}>
              A plugin trust index, a job-fit checker, two realtime voice apps,
              a gas-price map, and a set of technical courses. All of them are
              live.
            </p>
            <p className={styles.introMeta}>
              Looking for my first full-time software engineering role. Seattle
              area or remote. US citizen. B.S. Computer Science, University of
              Maryland.
            </p>
          </motion.div>

          <div
            className={styles.reel}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsPaused(false);
              }
            }}
          >
            <div className={styles.reelStage}>
              <AnimatePresence initial={false}>
                <motion.a
                  key={activeProject.name}
                  className={styles.reelImage}
                  href={activeProject.live}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open the live ${activeProject.name} site`}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                >
                  <Image
                    src={activeProject.image}
                    alt={activeProject.alt}
                    fill
                    loading="eager"
                    sizes="(max-width: 900px) 100vw, 68vw"
                  />
                </motion.a>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeProject.name}-copy`}
                className={styles.reelSummary}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div>
                  <p className={styles.counter}>
                    {String(activeIndex + 1).padStart(2, "0")} / 04
                  </p>
                  <h2>{activeProject.name}</h2>
                </div>
                <div className={styles.reelDescription}>
                  <p>{activeProject.problem}</p>
                  <p className={styles.buildDetail}>{activeProject.build}</p>
                  <Link href={activeProject.href} className={styles.textLink}>
                    View case study <ArrowUpRight size={15} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className={styles.reelControls} aria-label="Choose a project">
              <div className={styles.progressTrack} aria-hidden="true">
                <span
                  key={`${activeIndex}-${isPaused}`}
                  className={styles.progressFill}
                  style={{
                    animationPlayState: isPaused ? "paused" : "running",
                    animationDuration: reduceMotion ? "0s" : "6s",
                  }}
                />
              </div>
              <div className={styles.reelTabs}>
                {reelProjects.map((project, index) => (
                  <button
                    key={project.name}
                    type="button"
                    aria-pressed={activeIndex === index}
                    className={
                      activeIndex === index
                        ? `${styles.reelTab} ${styles.reelTabActive}`
                        : styles.reelTab
                    }
                    onClick={() => setActiveIndex(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {project.name}
                  </button>
                ))}
              </div>
            </div>

            <p className={styles.srOnly} aria-live="polite">
              Showing {activeProject.name}
            </p>
          </div>
        </section>

        <section className={`${styles.container} ${styles.work}`} id="work">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionIndex}>01 / Work</p>
            <h2>Selected work</h2>
          </div>

          <div className={styles.projectList}>
            {projects.map((project, index) => (
              <motion.article
                key={project.name}
                className={
                  index % 2 === 1
                    ? `${styles.projectRow} ${styles.projectRowReverse}`
                    : styles.projectRow
                }
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <div className={styles.projectCopy}>
                  <p className={styles.projectNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3>{project.name}</h3>
                  <p className={styles.projectMeta}>
                    {project.category} · {project.year}
                  </p>
                  <p className={styles.projectProblem}>
                    <span>Problem.</span> {project.problem}
                  </p>
                  <p className={styles.projectBuild}>
                    <span>Built.</span> {project.build}
                  </p>
                  <Link href={project.href} className={styles.textLink}>
                    View project <ArrowUpRight size={15} />
                  </Link>
                </div>

                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projectImage}
                  aria-label={`Open the live ${project.name} site`}
                >
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 820px) 100vw, 68vw"
                  />
                </a>
              </motion.article>
            ))}
          </div>

          <Link href="/projects" className={styles.allProjectsLink}>
            Browse the full project archive <ArrowUpRight size={16} />
          </Link>
        </section>

        <section className={`${styles.container} ${styles.about}`} id="about">
          <div className={styles.aboutHeading}>
            <p className={styles.sectionIndex}>02 / About</p>
            <h2>Who I am / How I work.</h2>
          </div>

          <div className={styles.aboutGrid}>
            <div className={styles.aboutColumn}>
              <p className={styles.aboutLabel}>Who I am</p>
              <p className={styles.aboutLead}>
                I’m To Yin Yu, a software developer in Lynnwood, Washington. I
                finished my computer science degree at the University of
                Maryland in December 2022 and have been building and shipping my
                own products since 2024.
              </p>
              <p className={styles.aboutBody}>
                I do the whole job: the product decision, the frontend, the
                backend, deployment, and the part after launch where things
                break. Most of my recent work puts language models in
                production, so I spend a lot of time on cost limits, evaluation,
                and failure handling.
              </p>
              <div className={styles.timeline}>
                <p>
                  <span>2024—Now</span> Independent software developer
                </p>
                <p>
                  <span>2022</span> B.S. CS, University of Maryland
                </p>
              </div>
            </div>

            <div className={styles.principles}>
              <p className={styles.aboutLabel}>How I work</p>
              <ol>
                <li>
                  <span>01</span>
                  <div>
                    <h3>Bound the cost before launch</h3>
                    <p>
                      SoloMock and SoloYap mint short-lived keys, cap sessions
                      at 15 minutes, and rate-limit by IP, so an open voice app
                      cannot run up the OpenAI bill.
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <h3>Refuse bad data</h3>
                    <p>
                      Plugrade’s daily scrape only commits when row counts,
                      coverage, and day-over-day changes pass sanity gates. A
                      failed gate keeps yesterday’s snapshot and opens an issue.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <h3>Keep private data in the browser</h3>
                    <p>
                      How’s My Job Fit? parses resumes on the user’s machine and
                      stores nothing. The report never leaves the page.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}
