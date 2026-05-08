"""Generate Tony Yu's resume as an ATS-friendly PDF.

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


ACCENT = HexColor("#4f46e5")
MUTED = HexColor("#525252")
DARK = HexColor("#0a0a0a")


def main(out_path: str) -> None:
    doc = SimpleDocTemplate(
        out_path,
        pagesize=LETTER,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
        title="Tony Yu — Resume",
        author="Tony Yu",
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
        spaceAfter=10,
    )
    section_style = ParagraphStyle(
        "Section",
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=ACCENT,
        spaceBefore=10,
        spaceAfter=4,
    )
    role_style = ParagraphStyle(
        "Role",
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=DARK,
        spaceBefore=4,
        spaceAfter=0,
    )
    role_meta_style = ParagraphStyle(
        "RoleMeta",
        fontName="Helvetica",
        fontSize=9.5,
        leading=12,
        textColor=MUTED,
        spaceAfter=2,
    )
    body_style = ParagraphStyle(
        "Body",
        fontName="Helvetica",
        fontSize=10,
        leading=13,
        textColor=DARK,
        spaceAfter=2,
    )
    bullet_style = ParagraphStyle(
        "Bullet",
        fontName="Helvetica",
        fontSize=10,
        leading=13,
        textColor=DARK,
        leftIndent=12,
        bulletIndent=2,
        spaceAfter=2,
    )

    story = []

    story.append(Paragraph("TONY YU", name_style))
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
            "<b>Relevant coursework:</b> Advanced Data Structures, Artificial Intelligence, "
            "Data Science, Computer Architecture, Object-Oriented Programming, "
            "Functional Programming, Web Development, Computer Systems, Programming Handheld Systems.",
            body_style,
        )
    )

    # SKILLS
    story.append(Paragraph("TECHNICAL SKILLS", section_style))
    story.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#e4e4e7"), spaceAfter=4))
    skill_rows = [
        ("Languages", "Python, JavaScript/TypeScript, Java, Swift, C, Rust, OCaml, Ruby, SQL"),
        ("ML &amp; Data", "TensorFlow, Keras, scikit-learn, Pandas, NumPy, matplotlib, seaborn, SAS, Minitab"),
        ("Web &amp; Backend", "React, Next.js, Astro, FastAPI, Tailwind CSS, PostgreSQL, Redis"),
        ("Tools", "Docker, Git, Linux/Unix, Vercel, Netlify, Jupyter"),
    ]
    for label, items in skill_rows:
        story.append(Paragraph(f"<b>{label}:</b> {items}", body_style))

    # PROJECTS
    story.append(Paragraph("PROJECTS", section_style))
    story.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#e4e4e7"), spaceAfter=4))

    projects = [
        {
            "title": "SmartUrl — URL Shortening Platform",
            "stack": "Python, FastAPI, PostgreSQL, Redis, Docker",
            "links": '<a href="https://github.com/tonyx1998/SmartUrlServices" color="#4f46e5">github.com/tonyx1998/SmartUrlServices</a>',
            "bullets": [
                "Built a full-stack URL shortener with QR and barcode generation, click and scan analytics, and automatic page-title extraction.",
                "Implemented Redis-backed three-tier rate limiting (10 / 60 / unlimited req/min) and response caching to cut hot-path latency.",
                "Containerized every service with Docker Compose for reproducible local development and production deployments.",
            ],
        },
        {
            "title": "United Front Roofing — Marketing Site",
            "stack": "Astro, Tailwind CSS, JavaScript, Netlify",
            "links": '<a href="https://united-front-roofing.netlify.app" color="#4f46e5">united-front-roofing.netlify.app</a>',
            "bullets": [
                "Designed and shipped a complete marketing site for a local roofing business — landing pages, project gallery, and SEO-optimized routing.",
                "Built a rule-based AI chat assistant (no third-party API), a multi-step quote estimator, and a booking calendar.",
            ],
        },
        {
            "title": "Personal Portfolio",
            "stack": "Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion",
            "links": '<a href="https://personal-site-liart-beta.vercel.app" color="#4f46e5">personal-site-liart-beta.vercel.app</a>',
            "bullets": [
                "Built a responsive portfolio with dark/light theming, scroll-driven animations, a bento-grid project layout, and cursor-tracked spotlight cards.",
                "Implemented an in-house, React-19-clean theme provider with FOUC-prevention via a <i>beforeInteractive</i> inline script and a working accessible Contact form backed by Web3Forms.",
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
        {
            "title": "Schedule Creator",
            "stack": "Java",
            "links": '<a href="https://github.com/tonyx1998/Schedule-Creator" color="#4f46e5">github.com/tonyx1998/Schedule-Creator</a>',
            "bullets": [
                "Built a Java desktop application that generates conflict-free class schedules by modeling courses, time slots, and scheduling constraints.",
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

    doc.build(story)


if __name__ == "__main__":
    import sys

    out = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
    main(out)
    print(f"Wrote {out}")
