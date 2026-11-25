import type { NextConfig } from "next";

// Sent with every response. The site is static, embeds nothing from other
// origins and is never meant to be framed, so these only close doors it does
// not use. HTTPS enforcement (HSTS) is already added by the host.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'inline; filename="To-Yin-Yu-Resume.pdf"',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Plugrade is hidden until it launches. Temporary so the page can
        // come back without a cached permanent redirect in the way.
        source: "/projects/plugrade",
        destination: "/projects",
        permanent: false,
      },
      // The roofing case study moved to a shorter address.
      {
        source: "/projects/amex-roofing-site-ai-booking-agent",
        destination: "/projects/amex-roofing",
        permanent: true,
      },
      // The course and learning-tool projects are hidden from the portfolio.
      // Their old pages send visitors to the archive instead of a 404.
      ...[
        "programming-basics",
        "modern-web-dev-guide",
        "modern-ai-guide",
        "modern-security-engineer-guide",
        "modern-cloud-engineer-guide",
        "modern-data-engineering-guide",
        "swe-interview-guide",
        "throughline-technical-learning-ecosystem",
        "shipyard",
        "2026-skills-roadmap",
      ].map((slug) => ({
        source: `/projects/${slug}`,
        destination: "/projects",
        permanent: false,
      })),
      {
        source: "/:path*",
        has: [{ type: "host", value: "toyinyu.com" }],
        destination: "https://www.toyinyu.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icon",
      },
    ];
  },
};

export default nextConfig;
