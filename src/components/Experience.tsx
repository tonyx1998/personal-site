"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
  {
    type: "education",
    title: "B.S. Computer Science",
    company: "University of Maryland, College Park",
    period: "Dec 2022",
    description:
      "Coursework in Advanced Data Structures, AI, Data Science, Computer Architecture, OOP, Functional Programming, Web Development with JavaScript, and Computer Systems.",
    tags: ["Data Structures", "AI", "Data Science", "Web Dev"],
  },
];

export default function Experience() {
  return (
    <section
      id="education"
      className="py-24 px-4 sm:px-6"
      style={{ backgroundColor: "color-mix(in srgb, var(--muted) 30%, transparent)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-mono text-sm mb-2">04. education</p>
          <h2 className="text-3xl sm:text-4xl font-bold">Education</h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={`${exp.title}-${exp.company}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex gap-8 pl-16 md:pl-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } md:items-start`}
              >
                <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 z-10 w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-5">
                  {exp.type === "work" ? (
                    <Briefcase size={12} className="text-accent-foreground" />
                  ) : (
                    <GraduationCap size={12} className="text-accent-foreground" />
                  )}
                </div>

                <div className="md:w-1/2 p-5 rounded-xl border border-border bg-card">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold">{exp.title}</h3>
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-accent text-sm font-medium mb-3">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded font-mono bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
