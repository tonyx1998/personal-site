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
        leftMargin=0.55 * inch,
        rightMargin=0.55 * inch,
        topMargin=0.4 * inch,
        bottomMargin=0.4 * inch,
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
        spaceBefore=4,
        spaceAfter=2,
    )
    role_style = ParagraphStyle(
        "Role",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12.5,
        textColor=DARK,
        spaceBefore=2,
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
        leading=11.5,
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
            "Software developer with a B.S. in Computer Science from UMD and hands-on experience "
            "building deployed full-stack applications with Python, FastAPI, React, TypeScript, "
            "PostgreSQL, Redis, and Docker. Interested in backend, full-stack, and applied AI "
            "engineering roles.",
            summary_style,
        )
    )

    # SKILLS
    story.append(Paragraph("TECHNICAL SKILLS", section_style))
    story.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#e4e4e7"), spaceAfter=4))
    skill_rows = [
        ("Languages", "Python, JavaScript/TypeScript, Java, Swift, C, Rust, OCaml, Ruby, SQL"),
        ("Web &amp; Backend", "React, Next.js, Astro, FastAPI, Tailwind CSS, PostgreSQL, Redis"),
        ("ML &amp; Data", "TensorFlow, Keras, scikit-learn, Pandas, NumPy, matplotlib, seaborn"),
        ("Tools", "Docker, Git, Linux/Unix, Vercel, Netlify, Jupyter"),
    ]
    for label, items in skill_rows:
        story.append(Paragraph(f"<b>{label}:</b> {items}", body_style))

    # PROJECTS
    story.append(Paragraph("SELECTED PROJECTS", section_style))
    story.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#e4e4e7"), spaceAfter=4))

    projects = [
        {
            "title": "all-in-one-URL — Short URLs, QR Codes &amp; Barcodes",
            "stack": "Python, FastAPI, PostgreSQL, Redis, Docker, React, TypeScript, Tailwind CSS",
            "links": '<a href="https://all-in-one-url.vercel.app" color="#4f46e5">all-in-one-url.vercel.app</a>',
            "bullets": [
                "Built a FastAPI backend for short URLs, QR codes, and barcodes with per-resource analytics, Redis-backed caching and counter batching, and tiered SlowAPI rate limiting.",
                "Implemented JWT authentication with bcrypt password hashing and per-resource ownership while preserving existing anonymous resources.",
                "Containerized backend with Docker Compose and deployed full stack on Vercel, Render, Neon (Postgres), and Upstash (Redis).",
            ],
        },
        {
            "title": "United Front Roofing — Marketing Site &amp; AI Voice Agent",
            "stack": "Astro, TypeScript, Tailwind CSS, ElevenLabs, Cal.com API, Netlify",
            "links": '<a href="https://united-front-roofing.netlify.app" color="#4f46e5">united-front-roofing.netlify.app</a>',
            "bullets": [
                "Shipped an Astro + Tailwind marketing site with a rule-based chat assistant, multi-step quote estimator, project gallery, and SEO-optimized routing.",
                "Integrated an ElevenLabs voice agent with Cal.com API webhooks to answer roofing FAQs, triage emergency requests, and book real inspection appointments end-to-end.",
                "Versioned the system prompt and knowledge base as markdown with a repeatable Node setup script that patches the live agent in seconds.",
            ],
        },
        {
            "title": "Personal Portfolio",
            "stack": "Next.js, TypeScript, Tailwind CSS, Framer Motion",
            "links": '<a href="https://toyinyu.vercel.app" color="#4f46e5">toyinyu.vercel.app</a>',
            "bullets": [
                "Built a responsive portfolio with dark/light theming, scroll-driven animations, a bento-grid project layout, and a working accessible contact form.",
            ],
        },
        {
            "title": "Modern Web Dev Guide — 2026 Web Development Reference",
            "stack": "Docusaurus, TypeScript, React, MDX, Mermaid",
            "links": '<a href="https://tonyx1998.github.io/modern-web-dev-guide/" color="#4f46e5">tonyx1998.github.io/modern-web-dev-guide</a>',
            "bullets": [
                "Authored a ~9,000-line beginner-to-intermediate guide across 11 chapters covering web foundations, project lifecycle, the modern tech stack, AI integration, and career paths.",
                "Built the site with Docusaurus, MDX, and Mermaid diagrams, with full-text local search, dark-mode theming, and a GitHub Actions deploy pipeline to GitHub Pages.",
            ],
        },
        {
            "title": "Obesity Data Analysis",
            "stack": "Python, Pandas, NumPy, scikit-learn, matplotlib, seaborn",
            "links": '<a href="https://tonyx1998.github.io" color="#4f46e5">tonyx1998.github.io</a>',
            "bullets": [
                "Analyzed obesity patterns from public-health datasets, surfacing demographic and lifestyle trends with matplotlib/seaborn visualizations.",
                "Built and validated predictive models with scikit-learn and statsmodels to identify statistically significant risk factors.",
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
        story.append(Paragraph(p["links"], role_meta_style))
        for b in p["bullets"]:
            story.append(Paragraph(f"•&nbsp;&nbsp;{b}", bullet_style))

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
