// Checks every live and GitHub URL in src/lib/projects.data.json. When all of
// them answer 2xx or 3xx, stamps today's date into LINKS_CHECKED_ON in
// src/lib/site.ts so the "Live, checked <date>" line on the site stays true.
//
//   npm run check-links
//
// Exits 1 (and leaves the date alone) if any link fails.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "src/lib/projects.data.json");
const sitePath = path.join(root, "src/lib/site.ts");

const projects = JSON.parse(readFileSync(dataPath, "utf8"));
const urls = projects
  .filter((p) => !p.hidden)
  .flatMap((p) => [p.live, p.github])
  .filter(Boolean);

let failed = 0;
for (const url of urls) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (toyinyu.com link check)" },
      signal: AbortSignal.timeout(20_000),
    });
    const ok = res.status >= 200 && res.status < 400;
    console.log(`${ok ? "ok  " : "FAIL"} ${res.status} ${url}`);
    if (!ok) failed += 1;
  } catch (error) {
    console.log(`FAIL ---  ${url} (${error.message})`);
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`\n${failed} link(s) failed. LINKS_CHECKED_ON not updated.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const site = readFileSync(sitePath, "utf8");
const updated = site.replace(
  /LINKS_CHECKED_ON = "\d{4}-\d{2}-\d{2}"/,
  `LINKS_CHECKED_ON = "${today}"`
);
writeFileSync(sitePath, updated);
console.log(`\nAll ${urls.length} links ok. LINKS_CHECKED_ON = ${today}`);
