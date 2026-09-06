import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
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
