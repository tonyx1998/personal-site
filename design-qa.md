# Exhibition checkpoint design QA

final result: passed

No actionable P0/P1/P2 findings remain within the bounded checkpoint. Browser used: dedicated Chrome tab, because the Mac in-app browser was unavailable. Production-mode preview: http://127.0.0.1:4174/ on this Mac only.

## Visual evidence

- Source: `../references/To-Yin-Yu-Exhibition-Refined-Desktop.png` (1487 × 1058 pixels).
- Desktop capture: `qa/Portfolio-Checkpoint-Desktop.jpg` (1487 × 1058 pixels; CSS viewport 1487 × 1058; density 1).
- Source: `../references/To-Yin-Yu-Exhibition-Refined-Mobile.png` (853 × 1844 pixels).
- Mobile capture: `qa/Portfolio-Checkpoint-Mobile.jpg` (426 × 922 pixels; CSS viewport 426 × 922; density 1). Source normalized to 426 × 922 for comparison; approximately 2 source pixels per CSS pixel.
- State: homepage at scroll 0, SoloMock selected, light exhibition, menu closed.
- Combined full-view evidence: `qa/comparison-desktop.jpg`, `qa/comparison-mobile.jpg` (source left, implementation right), both opened and inspected.
- Focused copy/type/action evidence: `qa/comparison-copy-detail.jpg`, opened and inspected. Preview pixels were also inspected at full browser resolution; their small code text is illustrative rather than required portfolio reading.

## Comparison history and fixes

1. Initial browser pass found desktop hero/stage about 27px too low, title too wide, rail spread too far, and mobile content about 30px too low. Fixed header/hero margins, display size, mobile spacing and rail columns; recaptured.
2. Independent read-only review found P2 regression: existing case-study navigation targets `/#work`. Restored `#work`, `#top` and `#more`; verified Work navigation from the SoloMock case study in Chrome. Also widened the medium-desktop rule to 1350px and verified 1150 × 900 without rail crowding.
3. Side previews initially used undersized image variants. Increased their requested size to 45vw, rebuilt, recaptured and inspected. Consolidated the two main landmarks.
4. Final matched full-view and focused comparisons show no actionable P0/P1/P2 drift. Original screenshots deliberately retain their genuine editor/panel proportions instead of the mockup's rearranged screenshot content.

## Required fidelity surfaces

- Typography: existing Public Sans, with 800/900 weights added for the name and project titles. Display size, weight, tracking and wrapping follow the references closely. Small labels remain readable; secondary text is darker than the mockup for contrast. Minor type-outline differences are P3.
- Layout: same oversized name and split intro, copy-left/image-right stage, cropped neighboring previews, single rail, and mobile tabs/title/image/description/actions/arrows order. Matched desktop stage starts near y334 versus source y332. Mobile image starts near y420. Medium desktop and 320px width remain contained.
- Colors/tokens: intentional off-white #fafaf7, near-black #08090b, restrained yellow #f5fa00, readable secondary #51576d. Existing theme tokens remain on other routes; the exhibition consistently uses the reference's light palette.
- Images: original local SoloMock/Gasolytics result captures, Amex simulated receipt capture, and existing Amex cover reused. No photo/avatar or new generated imagery. The simple yellow backdrop is CSS geometry, as requested. Authentic screenshot proportions and letter sizes differ from the stylized reference; project descriptions and links carry the required legible information.
- Copy: compact drafts grounded in canonical JSON. Roles/contact sourced from the real checkout. SoloMock/Gasolytics personal; Amex client. Simulation and September 2026 data captions retained. Unverified hobby copy replaced by All projects. Original professional headline, summaries, contributions, tags, figure captions, supporting work and About text retained below the stage.

## Interaction and technical evidence

- Click tabs, arrow wraparound, Left/Right, Home/End and selection status: passed in Chrome.
- Mobile native menu open and Escape dismissal: passed.
- Horizontal pointer drag on the mobile viewport switched SoloMock → Gasolytics. This exercises the shared Pointer Events swipe path; physical touch-device testing remains unperformed.
- Viewports: 1487 × 1058, 1150 × 900, 426 × 922, 320 × 740. Document width matched viewport at the checked narrow/medium sizes; persistent controls remained available.
- SoloMock Explore project navigated to the unchanged case study; its Work link returned to `/#work`. Live destinations and resume/email URLs inspected without initiating project actions or mail.
- Final production-mode console error/warning records for port 4174: none. Transient development compilation errors occurred during editing, were fixed, and are absent from final build/runtime.
- Reduced motion: CSS inspected; project movement runs only under `prefers-reduced-motion: no-preference`; global reduce rule limits transitions/animations and disables smooth scrolling. Current browser preference was no-preference. The supported browser surface exposes viewport control but no motion emulation, so native reduced-motion rendering remains a test gap.
- Production build: passed, 27 static pages generated. TypeScript, ESLint, Prettier, four existing tests: passed. Resume regenerated with canonical script; byte-identical to committed resume.
- Server-rendered HTML contains curated/supporting summaries and project links without interaction: `qa/ssr-checks.json`. Metadata, JSON-LD, sitemap, robots and public route definitions retained.

## Follow-up polish / limits

- P3: tune desktop title outline and rail rhythm a few pixels if desired; no further loop for this checkpoint.
- P3: consider reducing repeated project copy while preserving meaningful crawlable text.
- Native reduced-motion and physical touch-device checks remain before a production rollout.
- SEO risk: content ordering and headline prominence changed. Crawlers retain substantive text and destinations; this is not a ranking guarantee or SEO campaign. Client hydration hides inactive stage panels but persistent server-rendered background content keeps all critical project destinations visible.
- No backend integrations, paid API calls, route migrations, push, merge, deployment or publication.
- Screenshot Library upload could not start because prepared uploads were unavailable to the current helper. Captures remain local; no upload outcome is claimed.
