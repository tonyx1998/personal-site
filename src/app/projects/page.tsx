import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsAll from "@/components/ProjectsAll";
import {
  projectsCollectionJsonLd,
  jsonLdScriptProps,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project To Yin Yu has shipped — full-stack apps, AI voice agents, data tools, and learning resources.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects · To Yin Yu",
    description:
      "Every project To Yin Yu has shipped — full-stack apps, AI voice agents, data tools, and learning resources.",
    url: "/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <script {...jsonLdScriptProps(projectsCollectionJsonLd)} />
      <Navbar />
      <main className="pt-16">
        <ProjectsAll />
      </main>
      <Footer />
    </>
  );
}
