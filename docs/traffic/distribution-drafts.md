# Engineering distribution drafts

Local drafts only. No posts, profile edits, or product repository edits have been made. Link to the existing case-study URLs; they currently show the prior copy until this local change is approved and published. Attach the existing evidence screenshot with its simulation/date label rather than implying a new production outcome.

## LinkedIn: SoloMock

A voice interviewer needs more than audio when the candidate is writing code.

In SoloMock, I connected a Monaco editor to the WebRTC conversation with debounced code snapshots. A 2.5-second pause reduces repetitive updates, at the cost of delaying the next snapshot. I also made session cleanup explicit: a lost connection stops audio and closes the peer while retaining the code and transcript for review.

The demo uses sample answers and simulated provider responses. Mocked failure checks establish cleanup behavior; they do not establish coaching accuracy or a hard spending cap.

I wrote up the implementation, tradeoffs, and evidence here:
https://www.toyinyu.com/projects/solomock

Media suggestion: public/projects/evidence/solomock-detail.png. Caption: Simulated connection loss with retained interview work and sample feedback.

## LinkedIn: Gasolytics

A gas-price map can render successfully while the data behind part of it is unavailable.

I built Gasolytics around dated AAA snapshots, with server-projected SVG geometry and browser map interactions. The useful distinction is between a source date, a read time, and a usable cached result. A fresh request does not make an older snapshot fresh.

My case study covers map rendering, trip-cost assumptions, and controlled cache/failure checks. The linked engineering article explains a later release boundary that rejects reported data-read failures even when the framework build exits successfully.

The screenshot is a historical September 2026 snapshot, and the failure checks use fixtures. These checks do not establish upstream data accuracy or customer impact.

Implementation and evidence:
https://www.toyinyu.com/projects/gasolytics-us-gas-price-map

Media suggestion: public/projects/evidence/gasolytics-result.png. Caption: California selected with dated price data and a state trend; captured September 5, 2026.

## GitHub profile README suggestion

Use a short engineering introduction and two direct case-study links rather than a long technology badge list. Suggested block:

> I’m To Yin Yu, a software developer near Seattle building web products across the interface, backend, and deployment.
>
> Selected engineering work:
>
> - [SoloMock: WebRTC voice, editor context, and session cleanup](https://www.toyinyu.com/projects/solomock)
> - [Gasolytics: server-rendered maps, dated snapshots, and failure boundaries](https://www.toyinyu.com/projects/gasolytics-us-gas-price-map)
>
> [Portfolio](https://www.toyinyu.com/) · [Résumé](https://www.toyinyu.com/resume.pdf) · [Contact](mailto:tonyx1998@gmail.com)

No GitHub repository link is suggested for SoloMock or Gasolytics: the portfolio's verified records expose live products, not public source repositories. If a profile README already exists, integrate this block with its current content after inspection rather than replacing it blindly. A README preview or pinned public repository is not proof of project deployment or user impact.

## Contextual author links: recommendations only

Live SoloMock, Gasolytics and Gasolytics methodology HTML already link to https://www.toyinyu.com/. Existing source has author links too. Preserve those links. Consider an additional concise “Engineering case study” link near product documentation/about content where readers have engineering intent, pointing directly to the corresponding case-study route. Keep the user-facing tool's primary tasks prominent; do not replace every author link or add repetitive footer keywords. No other repository was edited.

## Small distribution experiment after approval

Publish one post at a time using the inspected screenshots and existing URLs. Ask a concrete engineering question (for example, how readers distinguish stale from unavailable data). Record post date, destination and observed referral visits if the separately reviewed analytics baseline supports that observation. Report clicks/visits as observed counts, not conversion or SEO improvements without a defined measurement window. Confirm publication and any tracking changes separately.
