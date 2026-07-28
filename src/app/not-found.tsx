import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PortfolioFooter, PortfolioHeader } from "@/components/PortfolioChrome";
import portfolioStyles from "@/components/PortfolioHome.module.css";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={portfolioStyles.page}>
      <PortfolioHeader />
      <main className={styles.main}>
        <div className={styles.container}>
          <p>404 / Not found</p>
          <h1>This route doesn’t lead anywhere useful.</h1>
          <div className={styles.links}>
            <Link href="/">
              <ArrowLeft size={15} />
              Back home
            </Link>
            <Link href="/projects">
              Browse projects
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </main>
      <PortfolioFooter />
    </div>
  );
}
