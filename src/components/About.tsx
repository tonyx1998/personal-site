"use client";

import { motion } from "framer-motion";
import { Code2, Coffee, GraduationCap, Rocket } from "lucide-react";

const stats = [
  { icon: GraduationCap, value: "B.S.", label: "CS @ UMD" },
  { icon: Code2, value: "12+", label: "Languages Known" },
  { icon: Rocket, value: "5+", label: "Projects Built" },
  { icon: Coffee, value: "∞", label: "Coffees Consumed" },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-mono text-sm mb-2">01. about</p>
          <h2 className="text-3xl sm:text-4xl font-bold">About Me</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <CodeCard />
            <div className="absolute -bottom-3 -right-3 w-full max-w-sm h-full rounded-2xl border-2 border-accent/30 -z-10 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 text-muted-foreground leading-relaxed"
          >
            <p>
              I&apos;m Tony Yu — a software developer with a B.S. in Computer Science from
              the University of Maryland, College Park.
            </p>
            <p>
              I build practical software that turns ideas into working products: FastAPI
              backends, React and Next.js frontends, PostgreSQL data models, Redis-backed
              performance improvements, and AI integrations.
            </p>
            <p>
              I&apos;m currently looking for software engineering roles where I can
              contribute across backend, frontend, and applied AI systems.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card text-center"
            >
              <Icon className="w-6 h-6 text-accent mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodeCard() {
  const kw = "text-violet-400";
  const id = "text-sky-400";
  const prop = "text-rose-400";
  const str = "text-emerald-400";
  return (
    <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/40">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs text-muted-foreground font-mono">tony.ts</span>
      </div>
      <pre className="font-mono text-[12.5px] sm:text-[13px] leading-[22px] p-5 text-foreground/85 whitespace-pre overflow-hidden">
        <code>
          <span className={kw}>const</span> <span className={id}>tony</span> = {"{\n"}
          {"  "}<span className={prop}>name</span>: <span className={str}>{"'To Yin Yu'"}</span>,{"\n"}
          {"  "}<span className={prop}>role</span>: <span className={str}>{"'Software Developer'"}</span>,{"\n"}
          {"  "}<span className={prop}>edu</span>: <span className={str}>{"'B.S. CS, UMD'"}</span>,{"\n"}
          {"  "}<span className={prop}>stack</span>: [{"\n"}
          {"    "}<span className={str}>{"'Next.js'"}</span>, <span className={str}>{"'FastAPI'"}</span>,{"\n"}
          {"    "}<span className={str}>{"'TensorFlow'"}</span>, <span className={str}>{"'Python'"}</span>,{"\n"}
          {"  "}],{"\n"}
          {"  "}<span className={prop}>status</span>: <span className={str}>{"'open to work'"}</span>,{"\n"}
          {"};"}
          <span className="inline-block w-1.5 h-4 align-middle ml-1 bg-accent animate-pulse" />
        </code>
      </pre>
    </div>
  );
}
