"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const data = {
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(timeout);
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
