import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: "variable",
  style: "normal",
  axes: ["opsz"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "To Yin Yu · Web products built with AI coding tools",
    template: "%s · To Yin Yu",
  },
  description:
    "To Yin Yu builds and operates web products by directing AI coding agents. Selected work in client booking, realtime voice, and data tools, with case studies.",
  applicationName: "To Yin Yu",
  keywords: [
    "To Yin Yu",
    "Seattle",
    "Web products",
    "AI coding agents",
    "Next.js",
    "TypeScript",
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
    title: "To Yin Yu · Web products built with AI coding tools",
    description:
      "Web products built and operated by directing AI coding agents. Explore selected work, case studies, and a one-page resume.",
    siteName: "To Yin Yu",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "To Yin Yu · Web products built with AI coding tools",
    description:
      "Web products built and operated by directing AI coding agents. Explore selected work, case studies, and a one-page resume.",
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
  themeColor: "#f3f4f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The layout reads no request data, so every route can be prerendered. The
  // site is light-only: there is no dark theme and no theme switch.
  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable}`}>
      <body className="min-h-screen antialiased bg-background text-foreground">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
