"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

const roles = [
  "Software Developer",
  "ML Researcher",
  "Data Scientist",
  "Problem Solver",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, 400);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-sm mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available for opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tight mb-4"
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-accent to-violet-500 bg-clip-text text-transparent">
            Tony Yu
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl sm:text-3xl text-muted-foreground font-mono mb-6 h-10"
        >
          <span>{displayed}</span>
          <span className="animate-pulse ml-0.5">|</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          B.S. in Computer Science from the University of Maryland. I build across the
          stack — full-stack web apps, ML pipelines in TensorFlow, and data science with Python.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity duration-200"
          >
            Get in touch
          </a>
          <a
            href="/resume.docx"
            download="Tony_Yu_Resume.docx"
            className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors duration-200"
          >
            Download Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          {[
            { icon: GithubIcon, href: "https://github.com/tonyx1998", label: "GitHub", external: true },
            { icon: LinkedinIcon, href: "https://www.linkedin.com/in/to-yin-yu", label: "LinkedIn", external: true },
            { icon: Mail, href: "mailto:tonyx1998@gmail.com", label: "Email", external: false },
          ].map(({ icon: Icon, href, label, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={label}
              className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown size={24} />
        </motion.div>
      </motion.a>
    </section>
  );
}
