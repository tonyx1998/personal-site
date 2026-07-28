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
    "A complete archive of full-stack products, public-data tools, realtime voice work, and technical learning projects by To Yin Yu.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects · To Yin Yu",
    description:
      "Full-stack products, public-data tools, realtime voice work, and technical learning projects by To Yin Yu.",
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
