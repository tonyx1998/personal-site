import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
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
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
