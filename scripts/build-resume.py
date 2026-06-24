"""Generate To Yin Yu's resume as an ATS-friendly PDF.

Single-column, standard fonts, semantic structure — designed to parse cleanly
through any applicant tracking system while still looking polished in a viewer.
"""

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
)
from reportlab.lib.enums import TA_LEFT
from pypdf import PdfReader


ACCENT = HexColor("#4f46e5")
MUTED = HexColor("#525252")
DARK = HexColor("#0a0a0a")


def main(out_path: str) -> None:
    doc = SimpleDocTemplate(
        out_path,
        pagesize=LETTER,
        leftMargin=0.5 * inch,
        rightMargin=0.5 * inch,
        topMargin=0.33 * inch,
        bottomMargin=0.33 * inch,
        title="To Yin Yu — Resume",
        author="To Yin Yu",
    )

    name_style = ParagraphStyle(
        "Name",
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=DARK,
        spaceAfter=2,
    )
    contact_style = ParagraphStyle(
        "Contact",
        fontName="Helvetica",
        fontSize=9.5,
        leading=12,
        textColor=MUTED,
        spaceAfter=6,
    )
    section_style = ParagraphStyle(
        "Section",
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=ACCENT,
        spaceBefore=3,
        spaceAfter=2,
    )
    role_style = ParagraphStyle(
        "Role",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12.5,
        textColor=DARK,
        spaceBefore=1.5,
        spaceAfter=0,
    )
    role_meta_style = ParagraphStyle(
        "RoleMeta",
        fontName="Helvetica",
        fontSize=9,
        leading=11,
        textColor=MUTED,
        spaceAfter=1,
    )
    body_style = ParagraphStyle(
        "Body",
        fontName="Helvetica",
        fontSize=9.5,
        leading=12,
        textColor=DARK,
        spaceAfter=1,
    )
    bullet_style = ParagraphStyle(
        "Bullet",
        fontName="Helvetica",
        fontSize=9.5,
        leading=11.0,
        textColor=DARK,
        leftIndent=12,
        bulletIndent=2,
        spaceAfter=0,
    )

    summary_style = ParagraphStyle(
        "Summary",
        fontName="Helvetica",
        fontSize=9.5,
        leading=12,
        textColor=DARK,
        spaceAfter=2,
    )

    story = []

    story.append(Paragraph("TO YIN YU", name_style))
    story.append(
        Paragraph(
            "Lynnwood, WA &nbsp;·&nbsp; +1 (206) 712-5144 &nbsp;·&nbsp; "
            '<a href="mailto:tonyx1998@gmail.com" color="#4f46e5">tonyx1998@gmail.com</a> '
            "&nbsp;·&nbsp; "
            '<a href="https://toyinyu.com" color="#4f46e5">toyinyu.com</a> '
            "&nbsp;·&nbsp; "
            '<a href="https://linkedin.com/in/to-yin-yu" color="#4f46e5">linkedin.com/in/to-yin-yu</a> '
            "&nbsp;·&nbsp; "
            '<a href="https://github.com/tonyx1998" color="#4f46e5">github.com/tonyx1998</a>',
            contact_style,
        )
    )
    story.append(HRFlowable(width="100%", thickness=0.6, color=HexColor("#d4d4d8"), spaceAfter=4))

    # SUMMARY
    story.append(Paragraph("SUMMARY", section_style))
    story.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#e4e4e7"), spaceAfter=4))
    story.append(
        Paragraph(
            "Entry-level full-stack software engineer (B.S. CS, UMD) shipping applied AI "
            "products end-to-end — realtime voice AI on OpenAI's Realtime API over WebRTC, "
            "FastAPI backends with Postgres + Redis, and production deploys on Vercel, "
            "Render, Neon, and Upstash. Open to junior SWE roles.",
            summary_style,
        )
    )

    # SKILLS
    story.append(Paragraph("TECHNICAL SKILLS", section_style))
    story.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#e4e4e7"), spaceAfter=4))
    skill_rows = [
        ("Languages", "TypeScript, Python, JavaScript, SQL"),
        ("Web &amp; Backend", "Next.js, React, FastAPI, Tailwind CSS, PostgreSQL, Redis"),
        ("Applied AI &amp; Realtime", "OpenAI Realtime API, WebRTC, ElevenLabs, LLM tool use, TensorFlow, Keras"),
        ("Infra &amp; Deploys", "Docker, Git, Linux/Unix, Vercel, Render, Neon, Upstash, Netlify"),
    ]
    for label, items in skill_rows:
        story.append(Paragraph(f"<b>{label}:</b> {items}", body_style))

    # PROJECT EXPERIENCE
    story.append(
        Paragraph(
            "PROJECT EXPERIENCE &nbsp;·&nbsp; "
            "<font color='#0a0a0a'>Independent Software Projects, 2024 – Present</font>",
            section_style,
        )
    )
    story.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#e4e4e7"), spaceAfter=4))

    projects = [
        {
            "title": "SoloMock — AI Voice Mock Interviewer",
            "date": "2025",
            "stack": "Next.js, TypeScript, OpenAI Realtime API, WebRTC, Monaco, Tailwind CSS, Vercel",
            "links": '<a href="https://solomock.com" color="#4f46e5">solomock.com</a>',
            "bullets": [
                "Built a realtime voice mock-interview app on OpenAI's Realtime API over WebRTC: the candidate speaks through coding problems while the AI probes complexity, gives Socratic hints, and reads code via debounced Monaco-editor snapshots streamed over a WebRTC data channel.",
                "Authored 15 structured per-problem &quot;interviewer briefs&quot; (solution tree, 4-rung hint ladder, follow-ups, and edge cases) that drive interviewer behavior through the system prompt.",
                "Hardened sessions against cost and abuse: server-minted ephemeral API keys so the browser never holds the long-lived secret, per-IP rate limits, a 15-minute session cap, and a Discord-webhook request-access flow with manual allowlisting.",
            ],
        },
        {
            "title": "Reachspan — AI Lead-Gen via Social Listening",
            "date": "2026",
            "stack": "Python, FastAPI, Claude / LLM Tool Use, Vercel Serverless, Cal.com API, Tailwind CSS",
            "links": '<a href="https://reachspan.ai" color="#4f46e5">reachspan.ai</a>',
            "bullets": [
                "Founded and built Reachspan, an AI lead-gen service: a Python + FastAPI + Claude engine that monitors Reddit and other channels, classifies buying intent against a configurable ruleset, and drafts brand-safe replies queued for human review.",
                "Built the marketing site with Vercel serverless functions wired to the Cal.com API so prospects book audit calls end-to-end with auto-confirmation.",
                "Designed the classification and human-in-the-loop pipeline (YAML-defined criteria, scored leads persisted to SQLite) to keep automated outreach on-brand.",
            ],
        },
        {
            "title": "all-in-one-URL — Short URLs, QR Codes &amp; Barcodes",
            "date": "2024",
            "stack": "Python, FastAPI, PostgreSQL, Redis, Docker, React, TypeScript, Tailwind CSS",
            "links": '<a href="https://all-in-one-url.vercel.app" color="#4f46e5">all-in-one-url.vercel.app</a>',
            "bullets": [
                "Built a FastAPI backend for short URLs, QR codes, and barcodes with per-resource click/scan analytics, Redis-backed caching and counter batching, and tiered SlowAPI rate limiting.",
                "Implemented JWT auth with bcrypt hashing and per-resource ownership (preserving anonymous resources); containerized the two-tier app with Docker Compose and deployed across Vercel, Render, Neon (Postgres), and Upstash (Redis).",
            ],
        },
        {
            "title": "Gasolytics — US Gas Price Map",
            "date": "2026",
            "stack": "Next.js 16, React 19, TypeScript, d3-geo, Vercel",
            "links": '<a href="https://www.gasolytics.com/" color="#4f46e5">gasolytics.com</a>',
            "bullets": [
                "Built an interactive US gas-price map with a d3-geo choropleth projected to SVG server-side (so no d3 ships to the client), metro price pins, wheel-zoom/drag-pan, and per-state detail panels.",
                "Scrapes AAA's daily state and metro averages server-side for all 50 states + DC across 4 fuel grades, with a 30-minute in-memory cache and a daily Vercel cron job accruing price-history snapshots.",
            ],
        },
        {
            "title": "Throughline — Technical Learning Ecosystem",
            "date": "2026",
            "stack": "Docusaurus, Astro, React, TypeScript, MDX",
            "links": '<a href="https://throughline-ashen.vercel.app" color="#4f46e5">hub</a> &nbsp;·&nbsp; '
            '<a href="https://tonyx1998.github.io/modern-web-dev-guide/" color="#4f46e5">web-dev</a> &nbsp;·&nbsp; '
            '<a href="https://tonyx1998.github.io/modern-ai-guide/" color="#4f46e5">ai</a> &nbsp;·&nbsp; '
            '<a href="https://tonyx1998.github.io/modern-security-engineer-guide/" color="#4f46e5">security</a>',
            "bullets": [
                "Built Throughline, a connected source-available learning ecosystem: five first-principles guides (web dev, AI, security, cloud, programming basics) on one shared design system, an Astro hub, and Shipyard &mdash; a build-a-project-and-AI-grade-it platform (Claude-as-judge).",
            ],
        },
    ]

    for p in projects:
        story.append(
            Paragraph(
                f"<b>{p['title']}</b> &nbsp;|&nbsp; <font color='#525252'>{p['stack']}</font>",
                role_style,
            )
        )
        story.append(
            Paragraph(
                f"{p['links']} &nbsp;·&nbsp; <font color='#525252'>{p['date']}</font>",
                role_meta_style,
            )
        )
        for b in p["bullets"]:
            story.append(Paragraph(f"- {b}", bullet_style))

    # EDUCATION
    story.append(Paragraph("EDUCATION", section_style))
    story.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#e4e4e7"), spaceAfter=4))
    story.append(
        Paragraph(
            "<b>University of Maryland, College Park</b> &nbsp;—&nbsp; College Park, MD",
            role_style,
        )
    )
    story.append(
        Paragraph(
            "Bachelor of Science, Computer Science &nbsp;·&nbsp; December 2022",
            role_meta_style,
        )
    )
    story.append(
        Paragraph(
            "<b>Relevant coursework:</b> Data Structures, Artificial Intelligence, "
            "Data Science, Computer Systems, Web Development.",
            body_style,
        )
    )

    doc.build(story)

    page_count = len(PdfReader(out_path).pages)
    if page_count != 1:
        raise RuntimeError(
            f"Resume must fit on one page; produced {page_count}. "
            "Trim content or tighten layout in build-resume.py."
        )


if __name__ == "__main__":
    import sys

    out = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
    main(out)
    print(f"Wrote {out}")
