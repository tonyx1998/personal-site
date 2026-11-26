import type { Metadata } from "next";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import ProjectTable from "@/components/ProjectTable";
import chrome from "@/components/Chrome.module.css";
import { projectVisual } from "@/lib/project-visuals";
import { projects, projectSlug, shortTitle } from "@/lib/projects";
import { DEFAULT_SHARE_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work table",
  description:
    "Six of To Yin Yu's web projects laid out as prints on a table. Open one to read what it does and how it was built.",
  alternates: {
    canonical: "/table",
  },
  openGraph: {
    title: "Work table · To Yin Yu",
    description:
      "Six web projects laid out as prints on a table. Open one to read what it does and how it was built.",
    url: "/table",
    type: "website",
    images: [DEFAULT_SHARE_IMAGE],
  },
};

export default function TablePage() {
  // A project needs a picture to get a print. The mat has six places, set by
  // hand in ProjectTable.module.css, so the first six are shown.
  const prints = projects
    .flatMap((project) => {
      const slug = projectSlug(project);
      const visual = projectVisual(project, slug);
      return visual
        ? [
            {
              slug,
              title: shortTitle(project),
              note: project.exhibition?.label ?? "",
              src: visual.src,
            },
          ]
        : [];
    })
    .slice(0, 6);
  return (
    <div className={chrome.page}>
      <PortfolioHeader />
      <main id="main-content" tabIndex={-1}>
        <ProjectTable prints={prints} />
      </main>
      <PortfolioFooter />
    </div>
  );
}
