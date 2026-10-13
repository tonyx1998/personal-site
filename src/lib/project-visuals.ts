export type ProjectVisual = {
  src: string;
  alt: string;
};

export const projectVisuals: Record<string, ProjectVisual> = {
  "hows-my-job-fit": {
    src: "/projects/howsmyjobfit.png",
    alt: "How's My Job Fit? workbench with a resume drop zone and report panel",
  },
  "gasolytics-us-gas-price-map": {
    src: "/projects/gasolytics.png",
    alt: "Gasolytics dashboard showing a United States fuel price map",
  },
  solomock: {
    src: "/projects/solomock.png",
    alt: "SoloMock realtime coding interview workspace",
  },
  soloyap: {
    src: "/projects/soloyap.png",
    alt: "SoloYap realtime English speaking practice workspace",
  },
  "amex-roofing-site-ai-booking-agent": {
    src: "/projects/amex-roofing.png",
    alt: "Amex Roofing home page with a roof photo and a free inspection call to action",
  },
  reachspan: {
    src: "/projects/reachspan-current-20261013.png",
    alt: "ReachSpan current English homepage with Get found. Follow through. headline, Hong Kong skyline, and free marketing audit form",
  },
  "throughline-technical-learning-ecosystem": {
    src: "/projects/throughline.png",
    alt: "Throughline technical learning platform home page",
  },
};

/** Reuse a study's meaningful result view as its homepage and archive cover. */
export function projectVisual(
  project: Project,
  slug: string
): ProjectVisual | undefined {
  const figure = project.caseStudy?.sections.find(
    (section) => section.figure
  )?.figure;
  return figure ? { src: figure.src, alt: figure.alt } : projectVisuals[slug];
}
import type { Project } from "./projects";
