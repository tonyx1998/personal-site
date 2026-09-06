"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/app/providers";
import styles from "./Chrome.module.css";

const navItems = [
  { label: "Work", href: "/#work" },
  { label: "All projects", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Resume (PDF)", href: "/resume.pdf" },
];
const subscribeToHydration = () => () => {};

function ThemeButton() {
  const { theme, toggle } = useTheme();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );
  // Reserve space without presenting a dead control when scripts are off.
  if (!hydrated)
    return <span className={styles.themeSpace} aria-hidden="true" />;
  const label = "Switch to " + (theme === "dark" ? "light" : "dark") + " theme";
  return (
    <button
      type="button"
      className={styles.themeButton}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}

export function PortfolioHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const current = (href: string) =>
    href === "/projects" && pathname.startsWith("/projects");
  return (
    <header className={styles.container + " " + styles.header}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <nav aria-label="Main navigation">
        <div className={styles.navBar}>
          <Link
            className={styles.wordmark}
            href="/"
            aria-label="To Yin Yu home"
          >
            To Yin Yu
          </Link>
          <div className={styles.desktopNav}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.navLink}
                aria-current={current(item.href) ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
          <ThemeButton />
        </div>
        <details
          ref={menu}
          className={styles.mobileDisclosure}
          onKeyDown={(event) => {
            if (event.key === "Escape" && menu.current?.open) {
              event.preventDefault();
              menu.current.open = false;
              menu.current.querySelector("summary")?.focus();
            }
          }}
        >
          <summary className={styles.menuButton}>
            <Menu size={18} className={styles.openIcon} aria-hidden="true" />
            <X size={18} className={styles.closeIcon} aria-hidden="true" />
            Menu
          </summary>
          <div className={styles.mobileMenu}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={current(item.href) ? "location" : undefined}
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </details>
      </nav>
    </header>
  );
}

export function PortfolioFooter() {
  return (
    <footer className={styles.container + " " + styles.footer} id="contact">
      <div className={styles.footerIntro}>
        <h2>Let’s talk.</h2>
        <p>
          Open to software engineering roles, near Seattle or further afield.
        </p>
      </div>
      <div className={styles.contact}>
        <a className={styles.email} href="mailto:tonyx1998@gmail.com">
          tonyx1998@gmail.com
        </a>
        <div className={styles.footerLinks}>
          <a href="/resume.pdf" download="To-Yin-Yu-Resume.pdf">
            Download PDF
          </a>
          <a href="https://github.com/tonyx1998">
            GitHub <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href="https://www.linkedin.com/in/to-yin-yu/">
            LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
