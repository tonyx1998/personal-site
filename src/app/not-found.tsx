import Link from "next/link";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import chrome from "@/components/Chrome.module.css";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={chrome.page}>
      <PortfolioHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className={`${chrome.container} ${styles.main}`}
      >
        <p className={styles.code}>404</p>
        <h1>There is no page at this address.</h1>
        <p className={styles.help}>
          The link may be old. Every project is listed on the projects page.
        </p>
        <div className={styles.links}>
          <Link href="/">Back to the homepage</Link>
          <Link href="/projects">See all projects</Link>
        </div>
      </main>
      <PortfolioFooter />
    </div>
  );
}
