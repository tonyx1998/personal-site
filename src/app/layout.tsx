import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "To Yin Yu · Software Developer",
    template: "%s · To Yin Yu",
  },
  description:
    "To Yin Yu, software developer near Seattle. Live products include Plugrade, How's My Job Fit?, SoloMock, and Gasolytics. Open to a first full-time role.",
  applicationName: "To Yin Yu",
  keywords: [
    "To Yin Yu",
    "Software Developer",
    "Software Engineer",
    "Seattle",
    "Next.js",
    "TypeScript",
    "Python",
    "OpenAI Realtime API",
    "Claude Code plugins",
    "Portfolio",
  ],
  authors: [{ name: "To Yin Yu" }],
  creator: "To Yin Yu",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "To Yin Yu · Software Developer",
    description:
      "Plugrade, How's My Job Fit?, SoloMock, SoloYap, Gasolytics, and Throughline. All live, all built and run by one person.",
    siteName: "To Yin Yu",
  },
  twitter: {
    card: "summary_large_image",
    title: "To Yin Yu · Software Developer",
    description:
      "Plugrade, How's My Job Fit?, SoloMock, SoloYap, Gasolytics, and Throughline. All live, all built and run by one person.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    other: {
      "msvalidate.01": "E09D7AAAC28BE85A4F39DF45D23AD785",
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

type ThemePref = "light" | "dark" | "auto";

// Runs before first paint: applies the saved theme, resolving the default
// (auto — anything that isn't an explicit light/dark) against the visitor's
// local clock, which the server can't know. Prevents a flash.
// Keep the 7pm–7am window in sync with timeBasedTheme() in providers.tsx.
const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem('theme');var r;if(p==='light'||p==='dark'){r=p;}else{var h=new Date().getHours();r=(h>=19||h<7)?'dark':'light';}document.documentElement.classList.toggle('dark',r==='dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep the layout static so content routes can be prerendered and cached.
  // The inline script applies the saved preference before content paints, and
  // Providers hydrates that same local preference on the client.
  const pref: ThemePref = "auto";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
        <Providers initialPref={pref}>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
