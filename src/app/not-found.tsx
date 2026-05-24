import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center py-24">
          <p className="text-accent font-mono text-sm mb-4">404</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Page not found
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity duration-200"
            >
              Back home
            </Link>
            <Link
              href="/projects"
              className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors duration-200"
            >
              See projects
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
