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
    src: "/projects/reachspan.png",
    alt: "ReachSpan landing page headline listing where a local business's next customer is",
  },
  "throughline-technical-learning-ecosystem": {
    src: "/projects/throughline.png",
    alt: "Throughline technical learning platform home page",
  },
};
