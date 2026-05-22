"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-mono text-sm mb-2">03. projects</p>
          <h2 className="text-3xl sm:text-4xl font-bold">Things I&apos;ve Built</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A few featured projects — see them all on the projects page.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 auto-rows-[minmax(220px,auto)] gap-6">
          {featured.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              className="lg:col-span-1"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-sm font-mono text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            See all projects
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
