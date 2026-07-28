export type ProjectVisual = {
  src: string;
  alt: string;
};

export const projectVisuals: Record<string, ProjectVisual> = {
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
  "throughline-technical-learning-ecosystem": {
    src: "/projects/throughline.png",
    alt: "Throughline technical learning platform home page",
  },
};
