"""Generate To Yin Yu's resume as an ATS-friendly PDF.

Single-column, standard fonts, semantic structure — designed to parse cleanly
through any applicant tracking system while still looking polished in a viewer.
"""

import json
from pathlib import Path

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

# Single source of truth shared with the website (src/lib/projects.ts imports it).
PROJECTS_JSON = Path(__file__).resolve().parent.parent / "src" / "lib" / "projects.data.json"


def _link_display(url: str) -> str:
    """solomock.com from https://www.solomock.com/ — for a clean résumé label."""
    s = url.split("://", 1)[-1]
    if s.startswith("www."):
        s = s[4:]
    return s.rstrip("/")


def load_resume_projects():
    """Pull the curated résumé subset from the shared JSON, ordered by resume.order.

    Site-facing metadata (live URL, github, date) is sourced here so it can never
    drift from the website; only the ATS-tuned bullets/stack/title are résumé-local.
    """
    data = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))
    out = []
    for p in data:
        r = p.get("resume")
        if not r:
            continue
        if r.get("linksOverride"):
            links = r["linksOverride"]
        else:
            parts = []
            if p.get("live"):
                parts.append(
                    f'<a href="{p["live"]}" color="#4f46e5">{_link_display(p["live"])}</a>'
                )
            if p.get("github"):
                parts.append(
                    f'<a href="{p["github"]}" color="#4f46e5">{_link_display(p["github"])}</a>'
                )
            links = " &nbsp;·&nbsp; ".join(parts)
        out.append(
            {
                "order": r.get("order", 999),
                "title": r.get("title") or p["title"],
                "date": r.get("date") or p.get("datePublished", ""),
                "stack": r["stack"],
                "links": links,
                "bullets": r["bullets"],
            }
        )
    out.sort(key=lambda x: x["order"])
    return out


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
            "Full-stack software engineer (B.S. CS, UMD) shipping applied AI "
            "products end-to-end — realtime voice AI on OpenAI's Realtime API over WebRTC, "
            "FastAPI backends with Postgres + Redis, and production deploys on Vercel, "
            "Render, Neon, and Upstash. Open to SWE roles.",
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

    projects = load_resume_projects()

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
