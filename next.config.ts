import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        // Reachspan was removed from the public project list.
        source: "/projects/reachspan",
        destination: "/projects",
        permanent: true,
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
