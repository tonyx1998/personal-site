"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { type Project, projectSlug, shortTitle } from "@/lib/projects";
import { projectVisual } from "@/lib/project-visuals";
import styles from "./Exhibition.module.css";

const subscribe = () => () => {};
const previewFor = (project: Project) => {
  const figure = project.caseStudy?.sections.find(
    (section) => section.figure
  )?.figure;
  const visual = projectVisual(project, projectSlug(project));
  return {
    src: figure?.originalSrc ?? visual!.src,
    alt: figure?.alt ?? visual!.alt,
  };
};

export default function Exhibition({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const menu = useRef<HTMLDetailsElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const requestedControl = useRef<"previous" | "next" | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tabRail = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const select = (index: number, focus = false) => {
    const next = (index + projects.length) % projects.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };
  useEffect(() => {
    const rail = tabRail.current;
    const tab = tabs.current[active];
    if (requestedControl.current) {
      stage.current
        ?.querySelector<HTMLButtonElement>(
          `article:not([hidden]) [data-direction="${requestedControl.current}"]`
        )
        ?.focus({ preventScroll: true });
      requestedControl.current = null;
    }
    if (!rail || !tab) return;
    const offset =
      tab.getBoundingClientRect().left -
      rail.getBoundingClientRect().left +
      rail.scrollLeft;
    rail.scrollTo({
      left: Math.max(0, offset - (rail.clientWidth - tab.clientWidth) / 2),
      behavior: "instant",
    });
  }, [active, hydrated]);
  const controls = (
    <>
      <button
        className={styles.arrow + " " + styles.previous}
        data-direction="previous"
        aria-label="Previous project"
        aria-controls={"panel-" + projectSlug(projects[active])}
        onClick={() => {
          requestedControl.current = "previous";
          select(active - 1);
        }}
      >
        <ArrowLeft aria-hidden="true" />
      </button>
      <button
        className={styles.arrow + " " + styles.next}
        data-direction="next"
        aria-label="Next project"
        aria-controls={"panel-" + projectSlug(projects[active])}
        onClick={() => {
          requestedControl.current = "next";
          select(active + 1);
        }}
      >
        <ArrowRight aria-hidden="true" />
      </button>
    </>
  );
  const nav = (
    <>
      <a
        href="#about"
        onClick={() => {
          if (menu.current) menu.current.open = false;
        }}
      >
        About
      </a>
      <a href="/resume.pdf">
        Resume<span className={styles.sr}> (PDF)</span>
      </a>
      <a
        href="#contact"
        onClick={() => {
          if (menu.current) menu.current.open = false;
        }}
      >
        Contact
      </a>
    </>
  );
  const rail = (
    <div className={styles.rail}>
      <span className={styles.counter} aria-hidden="true">
        {String(active + 1).padStart(2, "0")} /{" "}
        {String(projects.length).padStart(2, "0")}
      </span>
      <div
        className={styles.tabs}
        ref={tabRail}
        role={hydrated ? "tablist" : undefined}
        aria-label="Selected projects, scroll to browse"
      >
        {projects.map((project, index) =>
          hydrated ? (
            <button
              key={projectSlug(project)}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              role="tab"
              id={"tab-" + projectSlug(project)}
              aria-selected={active === index}
              aria-controls={"panel-" + projectSlug(project)}
              tabIndex={active === index ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => {
                const next =
                  event.key === "ArrowRight"
                    ? index + 1
                    : event.key === "ArrowLeft"
                      ? index - 1
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? projects.length - 1
                          : null;
                if (next !== null) {
                  event.preventDefault();
                  select(next, true);
                }
              }}
            >
              {shortTitle(project)}
            </button>
          ) : (
            <a
              key={projectSlug(project)}
              href={"#panel-" + projectSlug(project)}
            >
              {shortTitle(project)}
            </a>
          )
        )}
      </div>
    </div>
  );
  return (
    <section className={styles.exhibition} aria-label="Selected work" id="work">
      <header className={styles.header} id="top">
        <a className={styles.skip} href="#main-content">
          Skip to selected work
        </a>
        <Link className={styles.wordmark} href="/">
          To Yin Yu
        </Link>
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {nav}
        </nav>
        <details
          className={styles.menu}
          ref={menu}
          onKeyDown={(event) => {
            if (event.key === "Escape" && menu.current?.open) {
              menu.current.open = false;
              menu.current.querySelector("summary")?.focus();
            }
          }}
        >
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">{nav}</nav>
        </details>
      </header>
      <div className={styles.hero}>
        <h1>To Yin Yu</h1>
        <p>
          <span className={styles.roleIntro}>Software developer.</span>I build
          web products, realtime voice tools,
          <br className={styles.desktopBreak} /> and booking systems.
        </p>
      </div>
      <div id="main-content" className={styles.gallery} tabIndex={-1}>
        {rail}
        <div className={styles.stage} ref={stage}>
          {hydrated && (
            <div
              className={styles.side + " " + styles.leftSide}
              aria-hidden="true"
            >
              <Image
                src={
                  previewFor(
                    projects[(active - 1 + projects.length) % projects.length]
                  ).src
                }
                alt=""
                width={2048}
                height={1152}
                sizes="45vw"
              />
            </div>
          )}
          {projects.map((project, index) => {
            const slug = projectSlug(project);
            return (
              <article
                key={slug}
                id={"panel-" + slug}
                role={hydrated ? "tabpanel" : undefined}
                aria-labelledby={hydrated ? "tab-" + slug : "title-" + slug}
                hidden={hydrated && active !== index}
                className={styles.project}
                tabIndex={hydrated ? 0 : undefined}
              >
                <div className={styles.intro}>
                  <p className={styles.relationship}>
                    {project.exhibition?.relationship ??
                      (project.resume?.relationship === "Client project"
                        ? "Client project"
                        : "Personal project")}
                  </p>
                  <h2 id={"title-" + slug}>{shortTitle(project)}</h2>
                </div>
                <figure className={styles.figure}>
                  <div className={styles.previewShell}>
                    <div
                      className={styles.preview}
                      onPointerDown={(event) => {
                        gesture.current = {
                          x: event.clientX,
                          y: event.clientY,
                        };
                        event.currentTarget.setPointerCapture(event.pointerId);
                      }}
                      onPointerUp={(event) => {
                        const start = gesture.current;
                        gesture.current = null;
                        if (
                          start &&
                          Math.abs(event.clientX - start.x) > 60 &&
                          Math.abs(event.clientY - start.y) < 60
                        )
                          select(active + (event.clientX < start.x ? 1 : -1));
                      }}
                      onPointerCancel={() => {
                        gesture.current = null;
                      }}
                    >
                      <Image
                        src={previewFor(project).src}
                        alt={previewFor(project).alt}
                        width={2048}
                        height={1152}
                        sizes="(max-width: 980px) 86vw, 57vw"
                        loading={index === 0 ? "eager" : "lazy"}
                        draggable={false}
                      />
                    </div>
                    {hydrated && controls}
                  </div>
                  <figcaption>
                    <span>{project.exhibition?.caption}</span>
                    <span className={styles.dragHint}>
                      Swipe or drag to explore{" "}
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </figcaption>
                </figure>
                <div className={styles.description}>
                  <p>
                    {project.exhibition?.summary ?? project.homepageSummary}
                  </p>
                  <p className={styles.topics}>
                    {project.exhibition?.topics ??
                      project.tags.slice(0, 3).join(" · ")}
                  </p>
                  <Link className={styles.primary} href={"/projects/" + slug}>
                    Explore project{" "}
                    <ArrowUpRight size={19} aria-hidden="true" />
                  </Link>
                  {project.live && (
                    <a className={styles.live} href={project.live}>
                      Live site <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
          {hydrated && (
            <div
              className={styles.side + " " + styles.rightSide}
              aria-hidden="true"
            >
              <Image
                src={previewFor(projects[(active + 1) % projects.length]).src}
                alt=""
                width={2048}
                height={1152}
                sizes="45vw"
              />
            </div>
          )}
        </div>
        <p className={styles.sr} role="status" aria-live="polite">
          {shortTitle(projects[active])}, project {active + 1} of{" "}
          {projects.length}
        </p>
      </div>
      <footer className={styles.strip}>
        <Link href="/projects">
          All projects <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <a href="mailto:tonyx1998@gmail.com">
          <Mail size={19} aria-hidden="true" /> Say hello{" "}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </footer>
    </section>
  );
}
