import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "To Yin Yu · Software Developer",
    template: "%s · To Yin Yu",
  },
  description:
    "To Yin Yu, software developer near Seattle. Live products include How's My Job Fit?, SoloMock, Gasolytics, and a bilingual client site with an AI booking agent. Open to a first full-time role.",
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
    "Portfolio",
  ],
  authors: [{ name: "To Yin Yu", url: SITE_URL }],
  creator: "To Yin Yu",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "To Yin Yu · Software Developer",
    description:
      "How's My Job Fit?, SoloMock, SoloYap, Gasolytics, Amex Roofing, ReachSpan, and Throughline. All live, all built and run by one person.",
    siteName: "To Yin Yu",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "To Yin Yu · Software Developer",
    description:
      "How's My Job Fit?, SoloMock, SoloYap, Gasolytics, Amex Roofing, ReachSpan, and Throughline. All live, all built and run by one person.",
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
    { media: "(prefers-color-scheme: light)", color: "#f3f4f2" },
    { media: "(prefers-color-scheme: dark)", color: "#131716" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint. A saved choice wins; otherwise the system
// preference decides. Keep in sync with readResolvedTheme() in providers.tsx.
const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem('theme');var d=p==='dark'||(p!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The layout reads no request data, so every route can be prerendered. The
  // server sends the light theme; the inline script corrects the class before
  // anything paints.
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${publicSans.variable} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
