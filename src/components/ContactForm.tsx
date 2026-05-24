"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    if (!data.access_key) {
      console.error("Contact form: NEXT_PUBLIC_WEB3FORMS_KEY is not set");
      setStatus("error");
      return;
    }

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
      if (!json.success) {
        console.error("Contact form: Web3Forms returned failure", json);
      }
      if (json.success) {
        form.reset();
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Contact form: request failed", err);
      setStatus("error");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      onSubmit={handleSubmit}
      onInput={() => {
        if (status === "sent" || status === "error") setStatus("idle");
      }}
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
        disabled={status === "sending"}
        onClick={() => {
          if (status === "sent" || status === "error") setStatus("idle");
        }}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 disabled:opacity-60 transition-opacity duration-200"
      >
        {status === "idle" && (<><Send size={16} />Send Message</>)}
        {status === "sending" && (<><span className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />Sending...</>)}
        {status === "sent" && "Message sent! ✓ Send another"}
        {status === "error" && "Something went wrong — try again"}
      </button>
      {status === "error" && (
        <p className="text-sm text-muted-foreground text-center">
          Form not working? Email me directly at{" "}
          <a
            href="mailto:tonyx1998@gmail.com"
            className="text-accent underline underline-offset-2 hover:opacity-80"
          >
            tonyx1998@gmail.com
          </a>
        </p>
      )}
    </motion.form>
  );
}
