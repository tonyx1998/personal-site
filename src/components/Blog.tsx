"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const posts = [
  {
    title: "Building a Design System from Scratch",
    excerpt:
      "Learn how to architect a scalable component library that your entire team will love using.",
    date: "Apr 15, 2026",
    readTime: "8 min read",
    tag: "Frontend",
  },
  {
    title: "The Art of Writing Clean TypeScript",
    excerpt:
      "Patterns and practices I've learned over 3 years of TypeScript development in production.",
    date: "Mar 28, 2026",
    readTime: "6 min read",
    tag: "TypeScript",
  },
  {
    title: "Optimizing Next.js Apps for Performance",
    excerpt:
      "A deep dive into bundle analysis, lazy loading, and Core Web Vitals optimization.",
    date: "Mar 10, 2026",
    readTime: "10 min read",
    tag: "Next.js",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <p className="text-accent font-mono text-sm mb-2">06. blog</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Latest Writing</h2>
          </div>
          <a
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            All posts <ArrowRight size={14} />
          </a>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group p-6 rounded-xl border border-border bg-card flex flex-col gap-4 hover:border-accent/50 transition-colors duration-300 cursor-pointer"
            >
              <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded-full self-start">
                {post.tag}
              </span>

              <h3 className="font-semibold text-lg leading-snug group-hover:text-accent transition-colors">
                {post.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
