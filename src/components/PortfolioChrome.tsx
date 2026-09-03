"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/app/providers";
import styles from "./Chrome.module.css";

const navItems = [
  { label: "Work", href: "/#work", section: "home" },
  { label: "All projects", href: "/projects", section: "projects" },
  { label: "About", href: "/#about", section: "home" },
  { label: "Resume", href: "/resume.pdf", section: "resume" },
];

function ThemeButton({ className }: { className?: string }) {
  const { toggle } = useTheme();
  return (
    <button
      type="button"
      className={className ?? styles.themeButton}
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
    >
      <Sun size={16} className={styles.sun} aria-hidden="true" />
      <Moon size={16} className={styles.moon} aria-hidden="true" />
    </button>
  );
}

export function PortfolioHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (label: string, section: string) =>
    (label === "Work" && pathname === "/") ||
    (section === "projects" && pathname.startsWith("/projects"));

  const linkClass = (label: string, section: string) =>
    isActive(label, section)
      ? `${styles.navLink} ${styles.navLinkActive}`
      : styles.navLink;

  return (
    <header className={`${styles.container} ${styles.header}`}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.wordmark} href="/" aria-label="To Yin Yu home">
          To Yin Yu
        </Link>

        <div className={styles.desktopNav}>
          {navItems.map((item) =>
            item.section === "projects" ? (
              <Link
                key={item.label}
                href={item.href}
                className={linkClass(item.label, item.section)}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={linkClass(item.label, item.section)}
              >
                {item.label}
              </a>
            )
          )}
          <ThemeButton />
        </div>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={mobileOpen}
          aria-controls="portfolio-mobile-menu"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        {mobileOpen && (
          <div id="portfolio-mobile-menu" className={styles.mobileMenu}>
            {navItems.map((item) =>
              item.section === "projects" ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
            <div className={styles.mobileTheme}>
              <ThemeButton />
              <span>Light or dark</span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export function PortfolioFooter() {
  return (
    <footer className={`${styles.container} ${styles.footer}`} id="contact">
      <p>If you are hiring a developer who ships, let’s talk.</p>
      <div className={styles.footerLinks}>
        <a href="mailto:tonyx1998@gmail.com">tonyx1998@gmail.com</a>
        <a
          href="https://github.com/tonyx1998"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <ArrowUpRight size={14} />
        </a>
        <a
          href="https://www.linkedin.com/in/to-yin-yu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn <ArrowUpRight size={14} />
        </a>
        <a href="/resume.pdf">Resume (PDF)</a>
      </div>
    </footer>
  );
}
