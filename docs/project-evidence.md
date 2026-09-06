# Project evidence register

Reviewed and captured September 5, 2026, Pacific time. The capture timestamps fall on September 6 in UTC. This register supports the project copy in `src/lib/projects.data.json`; it is not a production certification or a record of customer outcomes.

## Evidence boundaries

- **Source verified:** implementation inspected in the local repositories listed below.
- **Locally exercised:** a specific contract passed with controlled dependencies. This does not establish production configuration or provider reliability.
- **Public UI observed:** the deployed interface was opened and captured. Amex and SoloMock outcomes were generated with browser-local test fixtures and are labeled as simulations in their captions.
- **Not established:** no user counts, conversion changes, latency improvements, spending savings, coaching accuracy, or client revenue effects were measured. The portfolio does not publish these claims.

Local source and deployed UI are separate evidence. No deployment-to-commit mapping was established. No product repository was edited for this work. Concurrent work was present in Amex and Gasolytics; the register does not claim to cover those later changes.

## Sources and claim decisions

| Project           | Local repository and observed HEAD                            | Evidence used                                                                                                              | Copy boundary                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Amex Roofing      | `CKGLandingPage`, `2de9190ef4aa090fc536331cde82f053f0a2aa7c`  | `index.html`, `js/home.js`, `api/book.js`, translation and service-area build scripts; booking and calendar-sync contracts | Bilingual HTML/CSS/JavaScript interface and serverless Calendar integration. Request receipt and slot-conflict recovery are shown. Older AI assistant, solar-estimator, and Tailwind claims were removed.      |
| SoloMock          | `solomock`, `a005e46f24b9187f2dfaf6db68a49f1f4b91d5b8`        | `components/interview/InterviewApp.tsx`, `lib/realtime.ts`, `lib/rateLimit.ts`, problem data and session-route tests       | Voice plus editor context, temporary credentials, debounced updates, and cleanup. No hard total cost cap or production Redis guarantee.                                                                        |
| Gasolytics        | `gasolytics`, `9cfc05ae713d5aaad8e45f36d58f5f632ed0ac0f`      | `src/lib/aaa.ts`, `store.ts`, `history.ts`, `usMap.ts`, map and trip-calculator components                                 | Server projection, published AAA snapshots, dated comparisons, in-process cache behavior. No numeric bundle reduction, station-level quote, or measured speed claim.                                           |
| How’s My Job Fit? | `Hows My Job Fit`, `05cab5958cdf573b2ee2d9806773a9cec876b6f1` | Document readers, deterministic scoring modules, privacy page, `app/api/count/route.ts`, package configuration             | Local document parsing happens in the browser. Optional URL retrieval and aggregate counters mean “stores nothing” is too broad. Hosting-platform claims were narrowed because the current source has changed. |

Repository paths above are relative to `/Users/tonyyu/repos`. Amex had concurrent generated-page and browser-code changes by the final register check; its booking/calendar contract files and API sources used here were unchanged. Gasolytics had unrelated page, style, navigation, and location work; its data-reader and geometry sources used here were unchanged. SoloMock and Job Fit were clean at the final source check.

Client versus independent relationships and project dates retain the existing portfolio’s account of the work. They are not inferred from repository ownership or verified as employment. Amex is labeled a client project. SoloMock and Gasolytics are independent products. Reachspan remains visible as compact supporting work, as requested. No engagement or commercial results were added for supporting projects.

### Amex Roofing

The public receipt distinguishes an inspection request from a confirmed appointment. The browser’s conflict path clears the unavailable time while preserving contact and address fields. The server validates source, contact fields, date, and time before delivery. Translation/build scripts maintain related English and Chinese pages. The native form fallback is covered by the existing booking contract.

Calendar-sync tests establish checkpoint behavior for notification failures. They do not prove that an optional outbox mode is enabled in production, so the resume does not say that every live booking uses queued delivery. End-to-end scheduling, duplicate requests across all channels, provider delay, and retry behavior remain useful controlled staging checks.

### SoloMock

The editor sends changed code after a 2.5-second debounce. This is a configuration value, not a measured response-time result. Problem briefs remain separate from the candidate-facing problem returned by the session route. The browser acquires microphone permission before requesting temporary session credentials; the provider key remains on the server.

The session timer runs in the client. Shared rate limiting depends on Redis configuration and falls back to process memory. Those controls are not an unbypassable duration limit or a global spending ceiling. The mock demonstration verifies UI integration and cleanup, not real audio transport, interviewer quality, or paid-session performance. A future coaching evaluation needs a fixed problem/session set and explicit assessment criteria.

### Gasolytics

`usMap.ts` projects geographic data into SVG path strings on the server. No bundle-size delta was measured; comments containing numeric savings were not reused. The application consumes snapshots published by the separate Databank project, rather than scraping AAA in the request path.

The reader’s cache lasts up to 30 minutes per process. Its source date, fetch time, page revalidation, and upstream publication cadence are distinct. A failed refresh can return a warm result marked stale; a cold reader without usable data raises an error. The local checks establish those reader behaviors, not consistent stale-state presentation in every public view.

The trip calculator exposes distance, fuel economy, grade, and area-price assumptions. A city distance can be replaced with user input. Area averages and estimates are not individual pump quotes.

## Captured figures

All files are actual browser screenshots, captured with reduced motion and animations disabled. They were not generated, composited, or enlarged. The `originals` files are separate captures at device scale 2 using the same CSS viewport. JSON `src` points to the 1× cover and `originalSrc` to the corresponding 2× image.

Paths below are relative to `public/projects/evidence/`.

| Cover                   | Cover pixels | Original pixels | State and provenance                                                                                    |
| ----------------------- | ------------ | --------------- | ------------------------------------------------------------------------------------------------------- |
| `amex-result.png`       | 1280 × 720   | 2560 × 1440     | Deployed booking UI, fictional homeowner inputs, simulated successful API response.                     |
| `amex-detail.png`       | 1280 × 960   | 2560 × 1920     | Deployed booking UI, simulated slot conflict, retained fields and cleared time.                         |
| `solomock-result.png`   | 1280 × 720   | 2560 × 1440     | Deployed workspace, sample Two Sum code and transcript, substituted media/WebRTC and session responses. |
| `solomock-detail.png`   | 1280 × 720   | 2560 × 1440     | Simulated connection loss, retained work, and fixture feedback.                                         |
| `gasolytics-result.png` | 1280 × 720   | 2560 × 1440     | Read-only public map with California selected, source date and price history visible.                   |
| `gasolytics-detail.png` | 1280 × 720   | 2560 × 1440     | Read-only public trip calculator with its default route and assumptions visible.                        |

Each original is `originals/<cover filename>`. Cover capture window: `2026-09-06T05:48:00Z`–`05:48:17Z`. Original capture window: `2026-09-06T05:56:36Z`–`05:56:54Z`.

Capture URLs were `https://amex-roofing.com/`, `https://www.solomock.com/`, `https://www.gasolytics.com/`, and `https://www.gasolytics.com/trip-gas-calculator`. Captures were visually inspected after correcting editor population and panel scroll positions; the earlier scout images are not used.

### Capture isolation and observed behavior

The browser harness blocked analytics endpoints and unhandled non-GET/HEAD requests. Amex API requests were all fulfilled inside the browser. The success fixture returned `ok: true` and `calendarCreated: true`; the conflict fixture returned HTTP 409 with `slot_taken` and the occupied window. Inputs used “Sample Homeowner,” “123 Example Street,” and a fictional 555 phone number. Neither scenario contacted the booking API or created a calendar event.

SoloMock replaced `getUserMedia` and `RTCPeerConnection` before loading the page. Session, SDP exchange, and feedback requests received local fixture responses. The actual Monaco model received a sample solution, and provider-shaped sample transcript events entered the application through its data channel. Changing the mock peer to `failed` stopped the mock audio track, closed the peer, and displayed the lost-connection message. One editor snapshot was observed. These are event observations, not throughput measurements. No microphone or paid provider session was used.

Gasolytics used public GET responses and its client-side calculator. No customer data, booking, account, or contact flow was involved. The dated public snapshot was observed as presented; the full upstream collection pipeline was not independently revalidated.

## Local checks performed

All product checks used a clean environment with a preload that throws on unexpected global `fetch`. Existing tests supplied their own controlled dependencies where needed. Source products were not built, deployed, or modified. Amex was not locally previewed, so no worktree preview gate was bypassed.

| Check                                          | Result                         | Meaningful boundary exercised                                                                                                                                            |
| ---------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Amex `scripts/test-booking-contract.cjs`       | Passed                         | Origin checks, validation, accepted date/time windows, JSON and native-form responses, controlled Calendar response contract.                                            |
| Amex `scripts/test-calendar-sync-contract.mjs` | Passed                         | Failed or thrown notification does not checkpoint; successful delivery does; timed-out state changes reconcile before retry.                                             |
| SoloMock selected Vitest suite                 | 23 tests passed across 3 files | `lib/problems.test.ts`, `lib/rateLimit.test.ts`, `app/api/session/route.test.ts`.                                                                                        |
| Gasolytics isolated data-reader harness        | Four checks passed             | Source date and national value preserved; warm cache reused; expired cache with unreadable input marked stale; cold failure raised an explicit error.                    |
| Portfolio content/asset checks                 | Passed                         | Three primary and four compact projects in agreed order; all 17 visible slugs preserved; hidden Plugrade retained; six covers and six originals have correct dimensions. |

The Gasolytics harness imported the real `src/lib/aaa.ts`, then changed its working directory to a temporary fixture directory containing `data/history.json`. The synthetic snapshot had CA/NV values and a declared `9/1/26` source date. After the first read, invalid JSON replaced the input. The warm read reused the cached object; advancing the clock by 31 minutes exercised stale fallback. A separate process with no warm cache exercised the cold error. No synthetic prices appear in the public screenshots.

Temporary capture harnesses and check output were stored in `/private/tmp/personal-site-evidence/` during implementation. This register and the checked-in screenshots are the durable evidence summary. Future product changes require renewed verification before strengthening the claims.
