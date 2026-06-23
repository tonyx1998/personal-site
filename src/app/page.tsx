import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import GitHubActivity from "@/components/GitHubActivity";
import VoiceDemoSection from "@/components/VoiceDemoSection";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  personJsonLd,
  websiteJsonLd,
  jsonLdScriptProps,
} from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <script {...jsonLdScriptProps(personJsonLd)} />
      <script {...jsonLdScriptProps(websiteJsonLd)} />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Suspense fallback={null}>
          <GitHubActivity />
        </Suspense>
        <VoiceDemoSection />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
