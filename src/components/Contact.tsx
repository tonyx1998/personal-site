"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const WEB3FORMS_KEY = "37dab554-63a7-4f57-842d-1f1acc2892d4";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      access_key: WEB3FORMS_KEY,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setStatus(json.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6"
      style={{ backgroundColor: "color-mix(in srgb, var(--muted) 30%, transparent)" }}
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
            Whether you have a project in mind, a job opportunity, or just want to
            chat — my inbox is always open.
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
                  <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                  <p className="text-foreground">Remote — Open to opportunities</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-3">Find me on</p>
              <div className="flex gap-3">
                {[
                  { icon: GithubIcon, href: "https://github.com/tonyx1998", label: "GitHub" },
                  { icon: LinkedinIcon, href: "https://www.linkedin.com/in/to-yin-yu/", label: "LinkedIn" },
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

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="What's this about?"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Tell me about your project or idea..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 disabled:opacity-60 transition-opacity duration-200"
            >
              {status === "idle" && (<><Send size={16} />Send Message</>)}
              {status === "sending" && (<><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Sending...</>)}
              {status === "sent" && "Message sent! ✓"}
              {status === "error" && "Something went wrong — try again"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
