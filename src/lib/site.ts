export const SITE_URL = "https://www.toyinyu.com";

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
