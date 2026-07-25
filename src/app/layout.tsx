import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
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
    default: "To Yin Yu — Full-Stack Engineer & Applied AI Builder",
    template: "%s · To Yin Yu",
  },
  description:
    "To Yin Yu — full-stack engineer building applied AI products with TypeScript, Python, Next.js, FastAPI, WebRTC, and the OpenAI Realtime API.",
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
      "Full-stack engineer shipping applied AI products with Next.js, FastAPI, WebRTC, and the OpenAI Realtime API.",
    siteName: "To Yin Yu",
  },
  twitter: {
    card: "summary_large_image",
    title: "To Yin Yu — Full-Stack Engineer & Applied AI Builder",
    description:
      "Full-stack engineer shipping applied AI products with Next.js, FastAPI, WebRTC, and the OpenAI Realtime API.",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await cookies()).get("theme")?.value;
  const pref: ThemePref =
    cookie === "light" || cookie === "dark" || cookie === "auto"
      ? cookie
      : "auto";
  // SSR best-guess class; the inline script corrects `auto` against the clock.
  const isDark = pref !== "light";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${isDark ? "dark" : ""} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <Providers initialPref={pref}>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
