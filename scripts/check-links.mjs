// Checks every live and GitHub URL in src/lib/projects.data.json and reports
// the ones that do not answer 2xx or 3xx. It changes no file.
//
//   npm run check-links
//
// Exits 1 if any link fails.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "src/lib/projects.data.json");

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
  console.error(`\n${failed} link(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${urls.length} links ok.`);
