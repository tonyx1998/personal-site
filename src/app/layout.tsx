import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
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
    default: "To Yin Yu — Full-Stack Engineer & Applied AI Builder",
    template: "%s · To Yin Yu",
  },
  description:
    "To Yin Yu — entry-level full-stack engineer building applied AI products with TypeScript, Python, Next.js, FastAPI, WebRTC, and the OpenAI Realtime API.",
  applicationName: "To Yin Yu",
  keywords: [
    "To Yin Yu",
    "Full-Stack Engineer",
    "Software Engineer",
    "Applied AI",
    "Next.js",
    "FastAPI",
    "Python",
    "TypeScript",
    "WebRTC",
    "OpenAI Realtime API",
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
    title: "To Yin Yu — Full-Stack Engineer & Applied AI Builder",
    description:
      "Entry-level full-stack engineer shipping applied AI products with Next.js, FastAPI, WebRTC, and the OpenAI Realtime API.",
    siteName: "To Yin Yu",
  },
  twitter: {
    card: "summary_large_image",
    title: "To Yin Yu — Full-Stack Engineer & Applied AI Builder",
    description:
      "Entry-level full-stack engineer shipping applied AI products with Next.js, FastAPI, WebRTC, and the OpenAI Realtime API.",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = (await cookies()).get("theme")?.value;
  const isDark = theme !== "light";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${isDark ? "dark" : ""} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
        <Providers initialTheme={isDark ? "dark" : "light"}>{children}</Providers>
      </body>
    </html>
  );
}
