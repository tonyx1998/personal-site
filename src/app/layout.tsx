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
    default: "To Yin Yu — Software Developer",
    template: "%s · To Yin Yu",
  },
  description:
    "To Yin Yu — software developer building full-stack apps and applied AI workflows with Python, TypeScript, Next.js, and FastAPI.",
  applicationName: "To Yin Yu",
  keywords: [
    "To Yin Yu",
    "Software Developer",
    "Applied AI",
    "Next.js",
    "FastAPI",
    "Python",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "To Yin Yu" }],
  creator: "To Yin Yu",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "To Yin Yu — Software Developer",
    description:
      "Software developer building full-stack apps and applied AI workflows. Python, TypeScript, Next.js, FastAPI.",
    siteName: "To Yin Yu",
  },
  twitter: {
    card: "summary_large_image",
    title: "To Yin Yu — Software Developer",
    description:
      "Software developer building full-stack apps and applied AI workflows. Python, TypeScript, Next.js, FastAPI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
