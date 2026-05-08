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
    default: "Tony Yu — Software Developer",
    template: "%s · Tony Yu",
  },
  description:
    "Tony Yu — full-stack developer and ML researcher. Building fast, accessible web apps with Next.js, FastAPI, and TensorFlow.",
  applicationName: "Tony Yu",
  keywords: [
    "Tony Yu",
    "Software Developer",
    "ML Researcher",
    "Next.js",
    "FastAPI",
    "TensorFlow",
    "Portfolio",
  ],
  authors: [{ name: "Tony Yu" }],
  creator: "Tony Yu",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Tony Yu — Software Developer",
    description:
      "Full-stack developer and ML researcher. Next.js, FastAPI, TensorFlow.",
    siteName: "Tony Yu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tony Yu — Software Developer",
    description:
      "Full-stack developer and ML researcher. Next.js, FastAPI, TensorFlow.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
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
      className={`${geistSans.variable} ${geistMono.variable} ${isDark ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-background text-foreground">
        <Providers initialTheme={isDark ? "dark" : "light"}>{children}</Providers>
      </body>
    </html>
  );
}
