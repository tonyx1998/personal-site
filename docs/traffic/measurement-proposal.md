# Measurement proposal — pending authorization

Existing Vercel Analytics baseline supplied by the analytics worker for September 15–October 12, 2026, complete UTC days:

| Site               | Reported visitors | Pageviews |
| ------------------ | ----------------: | --------: |
| Personal portfolio |                37 |        76 |
| Data Guide         |               266 |       715 |
| Gasolytics         |            11,425 |    16,074 |

These are reported platform counts. Personal-site traffic includes at least one audit/test path; do not describe all 37 as qualified prospects or infer applications, enquiries, conversions or search-driven visits. No personal-site or Data Guide custom-event rows were present in this window. Absence of rows alone does not prove absent instrumentation; the analytics worker is checking coverage. These counts are not being inserted into public portfolio copy.

## Minimal personal-site events to review

Reuse the existing analytics service if its supported event capability and existing instrumentation coverage are confirmed. Do not add a second analytics stack or duplicate existing events.

| Proposed event  | Exact trigger                              | Minimal properties                                                       | Meaning and limit                                                                                          |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `resume_click`  | Activate an existing résumé link           | `placement`: header or footer; current internal path                     | Interest in opening/downloading the résumé; does not establish a completed download, application or review |
| `contact_click` | Activate the existing mailto link          | `placement`; current internal path                                       | Intent to open an email client; does not establish that email was sent                                     |
| `project_click` | Activate a case-study or live-product link | allowlisted project slug; `destination`: case_study or live; `placement` | Movement toward project evidence or experience; does not establish a session or completed project task     |

Use an explicit, small vocabulary of internal paths and project slugs. Exclude email addresses, phone numbers, user-entered content, full external URLs, search queries and arbitrary URL query strings. Do not add identifiers, cookies or tracking configuration as part of this proposal. Do not count project-tab switching as a meaningful conversion.

Before implementation, the analytics worker should confirm whether these interactions are already covered and whether the existing plan supports custom events. Ask for explicit tracking-change approval only after the coverage and proposed implementation are concrete. This file is a proposal; no event code or analytics configuration was changed.

## Evaluation after publication and event approval

Record the SEO publication revision and time, distribution-post dates, and a defined UTC observation window. Compare equivalent complete-day windows and separate observed audit/test paths where possible. With 37 reported portfolio visitors in the current 28-day baseline, a small absolute change will be noisy; avoid percentages presented as reliable lift.

Use existing Google Search Console evidence for impressions, clicks, queries and indexing when access is verified. It complements Vercel pageviews/referrals; neither source alone establishes job enquiries. A click event is not a contact submission. Keep field performance separate from traffic counts and from the checkpoint's single unthrottled HTML fetch timings.

Data Guide and Gasolytics exercise/product-event proposals belong to their instrumentation owners after coverage verification. This portfolio checkpoint does not implement them or modify their repositories.
