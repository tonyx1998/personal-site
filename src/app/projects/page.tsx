import type { Metadata } from "next";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import ProjectsAll from "@/components/ProjectsAll";
import chrome from "@/components/Chrome.module.css";
import {
  projectsCollectionJsonLd,
  jsonLdScriptProps,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "All projects",
  description:
    "Explore To Yin Yu's software projects, client work, local tools, and technical courses, with case studies and project notes.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "All projects · To Yin Yu",
    description:
      "Software projects, client work, local tools, and technical courses, with case studies and project notes.",
    url: "/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <script {...jsonLdScriptProps(projectsCollectionJsonLd)} />
      <div className={chrome.page}>
        <PortfolioHeader />
        <main id="main-content" tabIndex={-1}>
          <ProjectsAll />
        </main>
        <PortfolioFooter />
      </div>
    </>
  );
}
