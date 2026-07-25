"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import AuroraBackground from "./ui/AuroraBackground";
import { useTheme } from "@/app/providers";

const roles = ["Full-Stack Engineer", "Applied AI Builder"];

export default function Hero() {
  const { theme } = useTheme();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <AuroraBackground intensity={theme === "dark" ? 1 : 0.6} />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-sm mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available for opportunities
        </motion.div>

        <motion.h1
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tight mb-4"
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-accent to-violet-500 bg-clip-text text-transparent">
            To Yin Yu
          </span>
        </motion.h1>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xl sm:text-2xl font-mono mb-6">
          {roles.map((role, i) => (
            <motion.span
              key={role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              className="flex items-center gap-x-3"
            >
              {i > 0 && (
                <span aria-hidden="true" className="text-border select-none">
                  /
                </span>
              )}
              <span className="role-shimmer">{role}</span>
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Full-stack engineer building applied AI products with
          TypeScript, Python, Next.js, FastAPI, WebRTC, and the OpenAI Realtime
          API. Recent work includes realtime voice tutors and mock-interview
          agents, plus a deployed analytics platform with auth, rate limiting,
          and Postgres.
        </motion.p>

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity duration-200"
          >
            Get in touch
          </a>
          <a
            href="/resume.pdf"
            download="To_Yin_Yu_Resume.pdf"
            className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors duration-200"
          >
            Download Resume
          </a>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          {[
            {
              icon: GithubIcon,
              href: "https://github.com/tonyx1998",
              label: "Visit GitHub profile (tonyx1998)",
              external: true,
            },
            {
              icon: LinkedinIcon,
              href: "https://www.linkedin.com/in/to-yin-yu/",
              label: "Visit LinkedIn profile (To Yin Yu)",
              external: true,
            },
            {
              icon: Mail,
              href: "mailto:tonyx1998@gmail.com",
              label: "Email tonyx1998@gmail.com",
              external: false,
            },
          ].map(({ icon: Icon, href, label, external }) => (
            <a
              key={label}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
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
        aria-label="Scroll to About section"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.a>
    </section>
  );
}
