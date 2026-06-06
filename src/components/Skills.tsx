"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Languages",
    skills: ["TypeScript", "Python", "JavaScript", "SQL"],
  },
  {
    title: "Web & Backend",
    skills: [
      "Next.js",
      "React",
      "FastAPI",
      "Tailwind CSS",
      "PostgreSQL",
      "Redis",
    ],
  },
  {
    title: "Applied AI & Realtime",
    skills: [
      "OpenAI Realtime API",
      "WebRTC",
      "ElevenLabs",
      "LLM Tool Use",
      "TensorFlow",
      "Keras",
    ],
  },
  {
    title: "Infra & Deploys",
    skills: [
      "Docker",
      "Git",
      "Linux/Unix",
      "Vercel",
      "Render",
      "Neon",
      "Upstash",
      "Netlify",
    ],
  },
];

const familiarWith = [
  "Rust",
  "OCaml",
  "Ruby",
  "Swift",
  "Java",
  "C",
  "Astro",
  "Pandas",
  "NumPy",
  "sklearn",
  "SAS",
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-24 px-4 sm:px-6"
      style={{
        backgroundColor: "color-mix(in srgb, var(--muted) 30%, transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-mono text-sm mb-2">02. skills</p>
          <h2 className="text-3xl sm:text-4xl font-bold">Tech Stack</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Technologies I use to bring ideas to life
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map(({ title, skills }, categoryIndex) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <h3 className="font-semibold text-accent mb-4 font-mono text-xs uppercase tracking-widest">
                {title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: categoryIndex * 0.1 + skillIndex * 0.05,
                    }}
                    className="px-3 py-1 text-sm rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-sm text-muted-foreground text-center"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-accent mr-2">
            Familiar
          </span>
          {familiarWith.join(" · ")}
        </motion.div>
      </div>
    </section>
  );
}
