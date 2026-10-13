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

## Latest user-requested refinement

final result: passed

Visual truth additionally includes `../references/portfolio-feedback.png`, inspected before changes (1693×619 crop, Gasolytics selected), and the explicit request for seven-project navigation, large transparent side arrows and an editorial lower section. Compare `qa/Refined-Feedback-Comparison.jpg` (source left/current right), opened together. Current capture uses CSS viewport 1693×1100, density 1, cropped at image top minus 51px to 1693×619. The preserved stage proportions/copy/assets match; additional controls and changed neighboring projects are intended revisions.

Final browser evidence: `qa/Refined-Exhibition-Desktop.jpg` at 1487×1058; `qa/Refined-Exhibition-Mobile.jpg` at 426×922; `qa/Refined-Editorial-Desktop.jpg` and `qa/Refined-Editorial-Mobile.jpg` at those same viewports, one viewport scrolled down. All opened and inspected. The matched feedback crop is focused evidence for copy, image and side-controls positioning; the full captures show the seven-item rail and editorial composition.

No P0/P1/P2 findings remain. The bounded independent reviewer found no concrete P0–P2 issue. Browser tests exercised every project using next arrows, then seven-to-one wrapping with focus retained on the new arrow. Keyboard End reveals Reachspan in the scrolling rail (subpixel geometry tolerance <1px); Home/Left/Right retain the established tab model. Native engineering disclosures open/close using Enter. Menu and Contact navigation work. Production-mode console error/warning records for port 4174 were empty.

Initial narrow-desktop check at 761px showed cramped copy and a wrapped primary action. Fixed by moving tablet/mobile stacking to 980px. Verified 320, 760, 980, 981, 1350 and 1351px: page width matches viewport; side targets stay wholly in viewport and are at least 56px wide (tablet/mobile), 58px at 981px and up to 132×180 on desktop. Mobile controls are 56×120 and overlap passive image edges only, never portfolio copy or links. Redundant bottom arrows are removed. The seven-item count and neighboring preview indexing use array length.

Typography/layout/color/image/content pass: original Public Sans and Newsreader; oversized black scope words with yellow underline; high-contrast editorial rows, native notes, serif About and black/white contact ending; no generic card grid or new imagery. Seven verified public projects/cover assets only. Reachspan uses an ownership-neutral Website & integration label, and ViralSignal was not added. Original professional headline, descriptions, contributions, tags/captions, supporting work and all case-study routes remain server-rendered (`qa/refinement-ssr-checks.json`). Native disclosures retain crawlable text and work without JS. All critical project links are also in the exhibition's server-rendered panels.

Build/type/lint/format/four tests passed; resume regeneration remained byte-identical. Reduced-motion styles were checked: no new continuous/scroll motion, instant rail positioning, project reveal only under no-preference, and global reduce rule covers arrow and disclosure transitions. Native motion emulation and physical touch-device validation remain the same known gaps. Pointer drag remains verified; no backend actions added.

## Pending rail alignment correction

final result: blocked

Exact source `../references/portfolio-alignment-feedback.png` was materialized and opened. It is a 1430×127 crop of the project rail; the full viewport is not supplied. The visible underline runs far beyond the last label while all seven labels are packed toward its left. Source inspection confirms that the rail container itself has symmetric margins, but a flex-start tab row and counter-only left track cause the apparent imbalance. The slight 77%/1450px rail versus 76%/1440px stage mismatch also existed.

Local CSS now matches rail/stage width, reserves symmetric edge tracks, and centers fitting labels through automatic outer margins. Smaller overflowing rails remain scrollable with zero auto margins. Mobile removes the empty balancing track and retains its existing stacking. All seven projects, side arrows and editorial asymmetry remain. Types/lint/format/four tests pass. Browser capture, measured alignment and interaction recheck are intentionally pending: another task may own the Mac browser. No browser acquisition or preview publication was performed for this correction yet.

### Pending circle removal

Both desktop/mobile decorative circle pseudo-element rules were removed entirely, with no replacement. Browser validation and combined separate-preview publication remain blocked on the coordinated Mac browser slot. The screenshot layout and side-arrow positions do not depend on the removed absolute-positioned circle.

## Combined alignment, circle removal and Reachspan refresh — verified

final result: passed

Supersedes the pending blocked entries above. Exact alignment/yellow screenshots were inspected earlier. Captured and inspected current Reachspan public English UI in Chrome at 1280×720 (qa/Reachspan-Current-UI-20261013.jpg). It shows the new Hong Kong skyline, Get found / Follow through headline and empty audit form. No bookings or project actions were performed.

Inspected combined desktop/mobile browser captures: qa/Aligned-No-Circle-Desktop.jpg (1487×1058) and qa/Aligned-No-Circle-Mobile.jpg (426×922), density 1. Fitting labels center at the viewport midpoint to <0.01px; matching 1430px and 1693px checks also exact. Original editorial asymmetry remains. No actionable P0/P1/P2 issue. Overflowing rails at 981/426/320px remain scrollable; document width matches viewport; Home/End and arrow wrapping/menu dismissal pass. Decorative circle pseudo-element returns content none at every checked width, with no substitute. Current Reachspan image visibly verified both in showcase and /projects/reachspan. The archive consumes that same visual map. Empty production-mode console error/warning records. Existing reduced-motion and physical-touch test limitations unchanged.

Actual image files refreshed: public/projects/reachspan.png and new public/projects/reachspan-current-20261013.png. Shared source map points to dated asset to prevent old optimizer cache reuse. Other project images/role claims/public routes unchanged. Current UI messaging is broader and Hong Kong-focused; existing portfolio contributions are retained as historical work scope, without asserting ownership or adding ViralSignal.
