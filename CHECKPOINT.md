# Portfolio exhibition checkpoint

Local branch: `checkpoint/exhibition-20261012`.
Source base: verified `git@github.com:tonyx1998/personal-site.git`, default branch master. The original `/Users/tonyyu/repos/personal-site` was clean and remains untouched. This isolated clone lives at `/Users/tonyyu/Documents/Codex/2026-10-12/task/portfolio-checkpoint`.

## Review

On this Mac, open http://127.0.0.1:4174/ (built preview left running). It is bound to loopback and is not reachable from a Windows/web device.

To restart:

```sh
cd /Users/tonyyu/Documents/Codex/2026-10-12/task/portfolio-checkpoint
npm run build
npm run start -- --hostname 127.0.0.1 --port 4174
```

For development, `npm run dev -- --hostname 127.0.0.1 --port 4173`. Dependencies are isolated copies, with no credentials required. `npm ci` can recreate them.

Desktop/mobile browser captures and comparisons are in `qa/`. See `design-qa.md` for visual assessment, interaction evidence, intentional differences and verification gaps. Reference PNGs are in the sibling `references/` directory. A source-and-evidence archive is prepared in the parent task directory for transfer; it excludes dependencies, Git metadata and build caches.

## Files changed

- `src/components/Exhibition.tsx`: interactive stage, tab keyboard model, gesture switching and mobile navigation.
- `src/components/Exhibition.module.css`: responsive reference layout, scoped palette, transitions.
- `src/components/PortfolioHome.tsx`: exhibition and retained original professional/background/supporting content.
- `src/lib/projects.data.json`, `src/lib/projects.ts`: concise canonical exhibition presentation fields.
- `src/app/layout.tsx`: additional weights of the existing Public Sans font only; metadata retained.
- `HANDOVER.md`, `design-qa.md`, `CHECKPOINT.md`, `qa/*`: checkpoint evidence and instructions.

Build, typecheck, lint, formatting, four existing tests and SSR destination checks pass. One bounded independent review caught the old Work anchor regression; fixed and browser-verified. Native reduced-motion emulation and physical touch-device testing remain gaps. Original project images differ from the stylized mock screenshot internals.

Native Library saving was attempted through the required current helper but failed before upload preparation: unavailable in this execution environment. Screenshots remain local artifacts. No public link was created. A separate preview publication requires user approval; do not deploy production or attach this branch to the existing production deployment automatically.

Actual task credit usage was not measurable. The approved 40–80-credit estimate was neither a measured forecast nor a hard cap. No paid project API session or new image generation was used.

## Latest refinement

Seven-item exhibition: SoloMock, Gasolytics, Amex Roofing, How's My Job Fit?, SoloYap, Throughline, Reachspan. Large transparent side arrows replace the bottom arrows; count and rail are dynamic and scroll on smaller screens. Native engineering-note disclosures, an Interface/Backend/After launch editorial opening, a biographical ledger and a contrasting contact ending replace the plain lower text stack. See the latest subsection in design-qa.md and Refined-\* captures for evidence. This revision updates only the previously authorized separate Vercel preview, with noindex retained and no production promotion.
