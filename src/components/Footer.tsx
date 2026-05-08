"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p className="font-mono text-accent font-semibold">&lt;TonyYu /&gt;</p>
        <p>Built with Next.js 15, TypeScript &amp; Tailwind CSS v4</p>
        <p>© {new Date().getFullYear()} · All rights reserved</p>
      </div>
    </footer>
  );
}
