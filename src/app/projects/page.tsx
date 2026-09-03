import type { Metadata } from "next";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import ProjectsAll from "@/components/ProjectsAll";
import portfolioStyles from "@/components/PortfolioHome.module.css";
import {
  projectsCollectionJsonLd,
  jsonLdScriptProps,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project To Yin Yu has shipped: Plugrade, How's My Job Fit?, SoloMock, SoloYap, Gasolytics, Throughline, client work, and technical courses.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects · To Yin Yu",
    description:
      "Every project To Yin Yu has shipped, from AI products to technical courses.",
    url: "/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <script {...jsonLdScriptProps(projectsCollectionJsonLd)} />
      <div className={portfolioStyles.page}>
        <PortfolioHeader />
        <main>
          <ProjectsAll />
        </main>
        <PortfolioFooter />
      </div>
    </>
  );
}
