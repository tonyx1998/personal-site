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
            <div className="aspect-square max-w-sm mx-auto rounded-2xl bg-muted border border-border flex items-center justify-center text-8xl">
              👤
            </div>
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
              I&apos;m Tony Yu (To Yin Yu) — a software developer with a B.S. in Computer
              Science from the University of Maryland, College Park (Dec 2022).
            </p>
            <p>
              I work across the full stack and into machine learning — building FastAPI
              services with Redis and Docker, training deep learning models in TensorFlow,
              and visualizing data with Python.
            </p>
            <p>
              I&apos;m actively looking for software engineering or data science roles where
              I can bring both my engineering and research background to real problems.
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
