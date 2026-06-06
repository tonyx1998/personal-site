"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import SwingingCard from "./SwingingCard";

export default function ProjectsAll() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            back home
          </Link>
          <p className="text-accent font-mono text-sm mb-2">all projects</p>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Things I&apos;ve Built
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            A complete list of projects I&apos;ve shipped — featured work, side
            experiments, and learning artifacts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {projects.map((project, i) => (
            <SwingingCard key={project.title} index={i}>
              <ProjectCard project={project} className="lg:col-span-1" />
            </SwingingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
