"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Component,
  Fragment,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ScenePrint } from "./ProjectTableScene";
import chrome from "./Chrome.module.css";
import styles from "./ProjectTable.module.css";

// three.js and the physics engine are about one megabyte. They are loaded
// only on this page, after it is idle, and never on the server.
const Scene = dynamic(() => import("./ProjectTableScene"), { ssr: false });

export type TablePrint = {
  slug: string;
  title: string;
  /** What the product is, in a few words. May be empty. */
  note: string;
  src: string;
};

type Layout = {
  key: number;
  prints: ScenePrint[];
  width: number;
  height: number;
  accent: string;
  ink: string;
};

/** Each word gets its own box, which the 3D print reads to place its text. */
const words = (text: string) =>
  text.split(" ").map((word, index) => (
    <Fragment key={index}>
      {index > 0 && " "}
      <span data-print-word>{word}</span>
    </Fragment>
  ));

/**
 * Reads where the stylesheet put the flat prints, so the 3D ones can start in
 * their place. The arrangement lives in ProjectTable.module.css only.
 */
function measure(mat: HTMLElement): Omit<Layout, "key"> | null {
  const papers = Array.from(
    mat.querySelectorAll<HTMLAnchorElement>("[data-print]")
  );
  if (!papers.length || !mat.clientWidth || !mat.clientHeight) return null;
  const tokens = getComputedStyle(mat);
  return {
    width: mat.clientWidth,
    height: mat.clientHeight,
    accent: tokens.getPropertyValue("--accent").trim(),
    ink: tokens.getPropertyValue("--ink").trim(),
    prints: papers.map((paper, index) => {
      const box = paper.parentElement as HTMLElement;
      const placed = getComputedStyle(box);
      return {
        slug: paper.dataset.print ?? String(index),
        href: paper.getAttribute("href") ?? "/projects",
        cx: box.offsetLeft + box.offsetWidth / 2,
        cy: box.offsetTop + box.offsetHeight / 2,
        w: paper.offsetWidth,
        h: paper.offsetHeight,
        turn: parseFloat(placed.getPropertyValue("--turn")) || 0,
        layer: parseInt(placed.getPropertyValue("--layer"), 10) || 0,
        paper,
      };
    }),
  };
}

/**
 * "fast": a graphics card draws WebGL 2. "slow": the browser can only draw it
 * in software, as on many remote desktops. "none": there is no WebGL 2.
 */
function graphics(): "fast" | "slow" | "none" {
  const probe = (strict: boolean) => {
    const context = document
      .createElement("canvas")
      .getContext("webgl2", { failIfMajorPerformanceCaveat: strict });
    if (!context) return null;
    const names = context.getExtension("WEBGL_debug_renderer_info");
    const renderer = names
      ? String(context.getParameter(names.UNMASKED_RENDERER_WEBGL))
      : "";
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return renderer;
  };
  const renderer = probe(true);
  if (renderer === null) return probe(false) === null ? "none" : "slow";
  // Some browsers start a software renderer without calling it a caveat.
  return /swiftshader|llvmpipe|software|basic render/i.test(renderer)
    ? "slow"
    : "fast";
}

/** If the 3D scene fails for any reason, the flat prints simply stay. */
class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ProjectTable({ prints }: { prints: TablePrint[] }) {
  const router = useRouter();
  const mat = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [live, setLive] = useState(false);
  // The 3D prints start on their own only when nothing speaks against it.
  // "choice": reduced motion, reduced data or software drawing, so the visitor
  // gets a button instead. "slow": it started and the device could not keep up.
  const [offer, setOffer] = useState<"choice" | "slow" | null>(null);
  const [still, setStill] = useState(false);
  // True from a press on the button until the scene shows or gives up.
  const [starting, setStarting] = useState(false);
  const busy = useRef(false);
  // "Tidy up" is offered once a print has left its place.
  const [moved, setMoved] = useState(false);
  const [tidy, setTidy] = useState(0);
  const [visible, setVisible] = useState(true);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const begin = async (quietly: boolean) => {
    const table = mat.current;
    if (!table || busy.current) return;
    busy.current = true;
    try {
      const pictures = Array.from(table.querySelectorAll("img"));
      await Promise.all([
        document.fonts.ready,
        ...pictures.map((picture) => picture.decode().catch(() => undefined)),
      ]);
      const next = measure(table);
      if (!next) return;
      setStill(quietly);
      setMoved(false);
      setLayout((current) => ({ ...next, key: (current?.key ?? 0) + 1 }));
    } finally {
      busy.current = false;
    }
  };
  const beginUnasked = useEffectEvent(() => void begin(false));

  useEffect(() => {
    const check = () => {
      const drawing = graphics();
      if (drawing === "none") return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const saving =
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData === true;
      if (drawing === "slow" || reduce || saving) setOffer("choice");
      else beginUnasked();
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(check, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(check, 600);
    return () => clearTimeout(id);
  }, []);

  // A different mat size means different print sizes, so the scene is rebuilt
  // from the flat prints. They show again for the moment that takes.
  const rebuild = useEffectEvent(() => {
    setLive(false);
    void begin(still);
  });
  useEffect(() => {
    const table = mat.current;
    if (!table || !layout) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const sizes = new ResizeObserver(() => {
      if (
        table.clientWidth === layout.width &&
        table.clientHeight === layout.height
      ) {
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(rebuild, 180);
    });
    sizes.observe(table);
    return () => {
      sizes.disconnect();
      clearTimeout(timer);
    };
  }, [layout]);

  useEffect(() => {
    const table = mat.current;
    if (!table) return;
    const seen = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    );
    seen.observe(table);
    return () => seen.disconnect();
  }, []);

  const giveUp = (reason: "slow" | null) => {
    setLayout(null);
    setLive(false);
    setStarting(false);
    if (reason) setOffer(reason);
  };

  return (
    <div className={chrome.container}>
      <header className={styles.intro}>
        <h1>Work table</h1>
        <p>
          Six projects, laid out as prints. Open one to read what it does and
          how it was built.
        </p>
      </header>

      <div className={styles.table}>
        <div className={styles.bar}>
          <nav className={styles.index} aria-label="Projects on the table">
            <ul>
              {prints.map((print) => (
                <li key={print.slug}>
                  <Link
                    href={"/projects/" + print.slug}
                    onFocus={() => setHighlighted(print.slug)}
                    onBlur={() => setHighlighted(null)}
                    onPointerEnter={() => setHighlighted(print.slug)}
                    onPointerLeave={() => setHighlighted(null)}
                  >
                    {print.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/projects">All projects</Link>
              </li>
            </ul>
          </nav>
          <div className={styles.controls}>
            {live ? (
              <>
                <p>
                  <span className={styles.forMouse}>
                    Drag a print to move it.
                  </span>
                  <span className={styles.forTouch}>
                    Press and hold a print to move it.
                  </span>
                </p>
                {moved && (
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => {
                      setTidy((count) => count + 1);
                      setMoved(false);
                    }}
                  >
                    Tidy up
                  </button>
                )}
              </>
            ) : starting ? (
              <p>Setting up the table…</p>
            ) : offer && !layout ? (
              <>
                <p>
                  {offer === "slow"
                    ? "Movement was switched off because this device draws it slowly."
                    : "The prints can be moved."}
                </p>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => {
                    setStarting(true);
                    void begin(true);
                  }}
                >
                  {offer === "slow" ? "Turn on anyway" : "Turn on movement"}
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className={styles.mat} ref={mat}>
          <ul className={styles.prints} data-live={live} aria-hidden="true">
            {prints.map((print) => (
              <li key={print.slug} className={styles.print}>
                <Link
                  href={"/projects/" + print.slug}
                  className={styles.paper}
                  data-print={print.slug}
                  tabIndex={-1}
                  draggable={false}
                >
                  <Image
                    src={print.src}
                    alt=""
                    width={1280}
                    height={720}
                    sizes="(max-width: 760px) 55vw, 340px"
                    loading="eager"
                    draggable={false}
                  />
                  <span className={styles.caption}>
                    <span className={styles.title}>{words(print.title)}</span>
                    {print.note && (
                      <span className={styles.note}>{words(print.note)}</span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {layout && (
            <SceneBoundary key={layout.key} onError={() => giveUp(null)}>
              <div className={styles.stage} data-live={live} aria-hidden="true">
                <Scene
                  prints={layout.prints}
                  width={layout.width}
                  height={layout.height}
                  accent={layout.accent}
                  ink={layout.ink}
                  tidy={tidy}
                  highlighted={highlighted}
                  still={still}
                  visible={visible}
                  onReady={() => {
                    setLive(true);
                    setStarting(false);
                  }}
                  onSlow={() => giveUp("slow")}
                  onMoved={() => setMoved(true)}
                  onOpen={(href) => router.push(href)}
                />
              </div>
            </SceneBoundary>
          )}
        </div>
      </div>
    </div>
  );
}
