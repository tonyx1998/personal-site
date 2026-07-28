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
    name: "Gasolytics",
    category: "Data platform",
    year: "2026",
    image: "/projects/gasolytics.png",
    alt: "Gasolytics dashboard showing a United States fuel price map",
    problem: "U.S. fuel-price data is noisy, scattered, and hard to explore.",
    build:
      "Daily AAA pipeline with server-rendered D3 maps, state trends, affordability, and trip cost.",
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
      "WebSocket audio streaming with transcript, code capture, and a Socratic AI interviewer.",
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

const reelProjects = [projects[1], projects[2], projects[0], projects[3]];

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
            <p className={styles.eyebrow}>
              Independent developer · Engineer · Product builder
            </p>
            <h1>I build useful software from messy systems.</h1>
            <p className={styles.introCopy}>
              I build realtime voice tools, public-data products, and the
              systems that keep them dependable.
            </p>
            <p className={styles.introMeta}>
              B.S. Computer Science — University of Maryland
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
                I’m To Yin Yu, an independent software developer who takes
                products from idea to production.
              </p>
              <p className={styles.aboutBody}>
                I move between product, frontend, backend, deployment, and the
                production details that make software dependable.
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
                    <h3>Own the whole path</h3>
                    <p>
                      Take projects from messy inputs to reliable systems I can
                      stand behind.
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <h3>Design the failure states</h3>
                    <p>
                      Anticipate what breaks and build the behavior before it
                      happens.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <h3>Start with the user’s task</h3>
                    <p>
                      Focus on the job to be done, then remove everything that
                      gets in the way.
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
