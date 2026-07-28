"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import styles from "./PortfolioHome.module.css";

const navItems = [
  { label: "Work", href: "/#work", section: "home" },
  { label: "All projects", href: "/projects", section: "projects" },
  { label: "About", href: "/#about", section: "home" },
  { label: "Resume", href: "/resume.pdf", section: "resume" },
];

export function PortfolioHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (label: string, section: string) =>
    (label === "Work" && pathname === "/") ||
    (section === "projects" && pathname.startsWith("/projects"));

  return (
    <header className={styles.header}>
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
                className={
                  isActive(item.label, item.section)
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={
                  isActive(item.label, item.section)
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                {item.label}
              </a>
            )
          )}
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
          </div>
        )}
      </nav>
    </header>
  );
}

export function PortfolioFooter() {
  return (
    <footer className={`${styles.container} ${styles.footer}`} id="contact">
      <p>Have a useful problem?</p>
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
      </div>
    </footer>
  );
}
