export const SITE_URL = "https://www.toyinyu.com";

// The generated share card, used by pages that have no image of their own.
// Keep the size and alt text in step with src/app/opengraph-image.tsx.
export const DEFAULT_SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "To Yin Yu, web products built with AI coding tools",
};

// The date every project's live URL last returned 200. Shown next to each
// product as "Live, checked <date>". Updated by `npm run check-links`, which
// only rewrites this value when every link passes.
export const LINKS_CHECKED_ON = "2026-09-03";

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
