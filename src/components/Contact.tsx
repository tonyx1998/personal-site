"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

const ContactForm = dynamic(() => import("./ContactForm"), {
  ssr: false,
  loading: () => <ContactFormSkeleton />,
});

function ContactFormSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="h-[78px]" />
        <div className="h-[78px]" />
      </div>
      <div className="h-[78px]" />
      <div className="h-[182px]" />
      <div className="h-12 rounded-lg bg-muted/50" />
    </div>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
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
          <p className="text-accent font-mono text-sm mb-2">05. contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold">Get In Touch</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Whether you have a project in mind, a job opportunity, or just want
            to chat — my inbox is always open.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-card border border-border">
                  <Mail size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <a
                    href="mailto:tonyx1998@gmail.com"
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    tonyx1998@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-card border border-border">
                  <MapPin size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Location
                  </p>
                  <p className="text-foreground">
                    Lynnwood, WA · Remote-friendly
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-3">Find me on</p>
              <div className="flex gap-3">
                {[
                  {
                    icon: GithubIcon,
                    href: "https://github.com/tonyx1998",
                    label: "Visit GitHub profile (tonyx1998)",
                  },
                  {
                    icon: LinkedinIcon,
                    href: "https://www.linkedin.com/in/to-yin-yu/",
                    label: "Visit LinkedIn profile (To Yin Yu)",
                  },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors duration-200"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
