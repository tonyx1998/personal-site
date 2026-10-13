# Personal-site SEO/content checkpoint

Prepared October 13, 2026 on `checkpoint/seo-case-studies-20261013`, based on live upstream `2c4d707fa81151146d71540c9cab1637fd094fba`. Local only: no branch push, PR, merge, preview publication, production deployment, external post/profile edit, or tracking change.

## Concrete changes

| Page       | Live before                                                                                 | Local draft                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoloMock   | Title “SoloMock · To Yin Yu”; description cut off after “interviewer…”; no OG/Twitter image | Title “SoloMock: WebRTC voice and code interview case study · To Yin Yu”; complete 139-character description; existing result screenshot for sharing     |
| Gasolytics | Title “Gasolytics · To Yin Yu”; description cut off after “their…”; no OG/Twitter image     | Title “Gasolytics: Next.js gas-price map and data case study · To Yin Yu”; complete 144-character description; existing dated map screenshot for sharing |

Both pages have concise engineering introductions, topic-specific section headings and a visible Problem / Decision / Tradeoff / Verified behavior summary. Original paragraphs, historical/simulation captions and explicit evidence limits remain. Existing live-product links, header résumé link and footer contact remain visible. CreativeWork author identifies To Yin Yu by name and canonical portfolio URL, rather than only referencing an ID on another page.

No new diagrams: the two existing result/detail screenshots already explain the interface and failure behavior. Search copy describes engineering work, not generic “best mock interview” or “cheapest gas” landingpages. No keyword stuffing, duplicate routes, invented outcomes, customer metrics, coaching claims, new features or source dates.

## Baseline evidence and limits

`live-baseline.json` records actual public HTML: HTTP 200, index/follow, correct self-canonical, CreativeWork/BreadcrumbList JSON-LD, and no case-study sharing image. robots and sitemap already work; the existing Gasolytics engineering article is present. These were retained, not described as broken.

One unthrottled Mac fetch measured approximately 403 ms / 49,123 bytes for SoloMock HTML and 225 ms / 50,376 bytes for Gasolytics HTML, both Vercel cache HIT. This includes transfer/body completion and is not a Core Web Vitals, LCP, INP, field-speed or ranking measurement. No performance defect or traffic gain is inferred. No scripts, fonts, images or client features were added: metadata reuses existing public 1280×720 PNGs (126,645 / 165,027 bytes). Existing eager/lazy responsive image behavior and 28 static routes remain. Product live links and observed contextual author links return 200.

SoloMock source `a005e46f24b9187f2dfaf6db68a49f1f4b91d5b8` confirms 2500 ms debounce and unchanged-code guard. Gasolytics local source `4360f545f738f4eceede0c80e088500755ebfe8c` retains per-process cache and stale fallback. Earlier mock/provider evidence remains September-scoped; these source inspections do not establish a new production-to-commit mapping or coaching/provider quality.

A separate worker owns analytics/Search Console access and traffic baseline research. No search-query volume, ranking, referral, CTR or conversion baseline is available in this checkpoint. Keep publication and any tracking changes as separate approval decisions.

## Validation

- `make verify`: eslint, four route/content tests, Prettier, Next typegen and TypeScript passed.
- `npm run build`: 28 static routes passed, including the preserved Gasolytics article.
- `metadata-validation.json`: built server HTML has one H1, full 139/144-character descriptions, correct canonical/indexable robots, OG/Twitter image dimensions/alt, valid JSON parsing and named CreativeWork author. Both evidence image files are readable 1280×720 PNGs; sitemap preserves article and excludes résumé-only ViralSignal.
- Canonical résumé generation to a temporary PDF matches committed SHA256 `d4de5c14877d1ee3dced4c7448afe4f34a6dec7c84badff12112c288a5802740` exactly. Committed PDF unchanged.
- Dedicated Chrome extension profile: both pages inspected at 1487×1058 and 426×922; mobile tradeoff rows inspected; no page overflow or captured console errors. Captures saved in task root. Browser viewport reset and slot released. Social platforms were not posted to or used to test their caches.
- Initial build with shared node_modules symlink failed Turbopack's filesystem-root boundary. Replaced only that agent-created symlink with a normal lockfile install; final build passed. No application workaround needed.

## Review and preview

Local server remains at `http://127.0.0.1:4178/projects/solomock` and `/projects/gasolytics-us-gas-price-map` on this Mac. This will not open from Windows. For cross-device interactive review, approve a separate preview publication first; keep it noindex and separate from production. Otherwise review the local diff, captions, screenshots and two posts in `distribution-drafts.md` before authorizing a release.
