"""Build a readable, single-column resume from the shared project records.

The output has selectable text and a checked reading order. These checks do not
promise how an applicant tracking system will interpret the document.
"""

import argparse
from html import escape, unescape
import json
import os
from pathlib import Path
import tempfile
from urllib.parse import urlsplit

from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parent.parent
PROJECTS_JSON = ROOT / "src" / "lib" / "projects.data.json"
ACCENT = HexColor("#1f4e6b")
MUTED = HexColor("#525252")
DARK = HexColor("#0a0a0a")
SUMMARY = (
    "Software developer building full-stack web products, realtime voice tools, "
    "and client booking systems with TypeScript, React, Next.js, and Python. "
    "B.S. in Computer Science, University of Maryland; based near Seattle and "
    "open to relocation."
)
CONTACT_LINKS = (
    ("mailto:tonyx1998@gmail.com", "tonyx1998@gmail.com"),
    ("https://toyinyu.com", "toyinyu.com"),
    ("https://linkedin.com/in/to-yin-yu", "linkedin.com/in/to-yin-yu"),
    ("https://github.com/tonyx1998", "github.com/tonyx1998"),
)

# Profiles select approved facts; project copy lives only in projects.data.json.
# The complete set of resume records remains the editable master.
PROFILES = {
    "default": {
        "title": "Software Developer | Full-Stack Web Applications",
        "projects": ("amex-roofing", "solomock", "gasolytics"),
        "skills": (
            ("Languages", "TypeScript, JavaScript, Python, SQL"),
            ("Frontend", "React, Next.js, HTML/CSS, Tailwind CSS"),
            ("APIs", "REST APIs, WebRTC, Vercel Serverless, Google Calendar API"),
            ("Tools", "Git, Vercel"),
        ),
    },
    "frontend": {
        "title": "Software Developer | Frontend Applications",
        "projects": ("gasolytics", "solomock", "throughline"),
        "skills": (
            ("Languages", "TypeScript, JavaScript, HTML/CSS"),
            ("Frontend", "React, Next.js, Tailwind CSS, d3-geo, Monaco"),
            ("Content systems", "Astro, Docusaurus, MDX"),
            ("Tools and APIs", "Git, Vercel, WebRTC"),
        ),
    },
    "product": {
        "title": "Software Developer | Product Engineering",
        "projects": ("amex-roofing", "gasolytics", "solomock"),
        "skills": (
            ("Languages", "TypeScript, JavaScript, HTML/CSS"),
            ("Frontend", "React, Next.js, Tailwind CSS"),
            ("APIs", "Google Calendar API, REST APIs, WebRTC, OpenAI Realtime API"),
            ("Tools", "Git, Vercel, Vercel Serverless"),
        ),
    },
    "ai": {
        "title": "Software Developer | Realtime Web Applications",
        "projects": ("solomock", "gasolytics", "amex-roofing"),
        "skills": (
            ("Languages", "TypeScript, JavaScript, HTML/CSS"),
            ("Realtime", "OpenAI Realtime API, WebRTC, Monaco"),
            ("Frontend", "React, Next.js, Tailwind CSS"),
            ("Tools and APIs", "Git, Vercel, Vercel Serverless, Google Calendar API"),
        ),
    },
    "backend": {
        "title": "Software Developer | Backend and Integrations",
        "projects": ("all-in-one-url", "amex-roofing", "solomock"),
        "skills": (
            ("Languages", "Python, TypeScript, JavaScript, SQL"),
            ("Backend and data", "FastAPI, PostgreSQL, Redis, REST APIs"),
            ("Integrations", "Google Calendar API, WebRTC, OpenAI Realtime API"),
            ("Tools", "Docker, Git, Vercel"),
        ),
    },
}


def plain(value: str) -> str:
    """Accept existing HTML entities, but keep project copy as plain text."""
    return unescape(value).replace("\u2013", "-").replace("\u2014", "-").replace("\u2011", "-")


def markup(value: str) -> str:
    return escape(plain(value))


def link(url: str, label: str | None = None) -> str:
    if label is None:
        parsed = urlsplit(url)
        label = (parsed.netloc.removeprefix("www.") + parsed.path).rstrip("/")
    return f'<a href="{escape(url, quote=True)}" color="#1f4e6b">{markup(label)}</a>'


def load_resume_projects(profile: str = "default", data_path: Path = PROJECTS_JSON):
    records = {}
    for project in json.loads(data_path.read_text(encoding="utf-8")):
        resume = project.get("resume")
        if not resume or not resume.get("id"):
            continue
        identifier = resume["id"]
        if identifier in records:
            raise ValueError(f"Duplicate resume id: {identifier}")
        records[identifier] = (project, resume)
    result = []
    for identifier in PROFILES[profile]["projects"]:
        if identifier not in records:
            raise ValueError(f"Profile {profile!r} is missing resume record {identifier!r}")
        project, resume = records[identifier]
        if project.get("hidden"):
            raise ValueError(f"Profile {profile!r} selects hidden project {identifier!r}")
        bullets = resume.get("bullets", [])
        if len(bullets) != 2 or not all(isinstance(b, str) and b.strip() for b in bullets):
            raise ValueError(f"Selected project {identifier!r} must have two approved bullets")
        relationship = resume.get("relationship")
        if relationship not in ("Client project", "Independent product"):
            raise ValueError(f"Selected project {identifier!r} needs an explicit relationship")
        url = project.get("live") or project.get("github")
        if (
            not url
            or urlsplit(url).scheme not in ("https", "http")
            or not urlsplit(url).netloc
        ):
            raise ValueError(f"Selected project {identifier!r} needs an HTTP evidence link")
        date = resume.get("date") or project.get("datePublished")
        if not date or not resume.get("stack"):
            raise ValueError(f"Selected project {identifier!r} needs a date and stack")
        result.append({
            "id": identifier,
            "title": plain(resume.get("title") or project["title"]),
            "relationship": relationship,
            "date": plain(date),
            "stack": plain(resume["stack"]),
            "url": url,
            "bullets": [plain(b) for b in bullets],
        })
    return result


def styles():
    body = ParagraphStyle("Body", fontName="Helvetica", fontSize=10.5, leading=13.5,
                          textColor=DARK, spaceAfter=2)
    return {
        "name": ParagraphStyle("Name", parent=body, fontName="Helvetica-Bold", fontSize=22,
                               leading=26, spaceAfter=3),
        "title": ParagraphStyle("Title", parent=body, spaceAfter=3),
        "contact": ParagraphStyle("Contact", parent=body, fontSize=9.5, leading=12,
                                  textColor=MUTED, spaceAfter=2),
        "section": ParagraphStyle("Section", parent=body, fontName="Helvetica-Bold", fontSize=11,
                                  leading=14, textColor=ACCENT, spaceBefore=10, spaceAfter=4,
                                  keepWithNext=True),
        "role": ParagraphStyle("Role", parent=body, fontName="Helvetica-Bold", fontSize=11,
                               leading=14, spaceAfter=9, keepWithNext=True),
        "project": ParagraphStyle("Project", parent=body, fontName="Helvetica-Bold", fontSize=11,
                                  leading=14, spaceAfter=2, keepWithNext=True),
        "meta": ParagraphStyle("Meta", parent=body, fontSize=9.5, leading=12, textColor=MUTED,
                               spaceAfter=3, keepWithNext=True),
        "body": body,
        "bullet": ParagraphStyle("Bullet", parent=body, leftIndent=12, bulletIndent=0,
                                 bulletFontName="Helvetica", bulletFontSize=10.5, spaceAfter=2),
    }


def build_story(projects, profile: str = "default"):
    style = styles()
    story = [
        Paragraph("TO YIN YU", style["name"]),
        Paragraph(markup(PROFILES[profile]["title"]), style["title"]),
        Paragraph("Lynnwood, WA (Seattle area) &nbsp;|&nbsp; US citizen", style["contact"]),
        Paragraph("(206) 712-5144 &nbsp;|&nbsp; "
                  + " &nbsp;|&nbsp; ".join(link(url, label) for url, label in CONTACT_LINKS),
                  style["contact"]),
    ]

    def section(title):
        story.append(Paragraph(title, style["section"]))
        rule = HRFlowable(width="100%", thickness=0.4, color=HexColor("#d4d4d8"), spaceAfter=4)
        rule.keepWithNext = True
        story.append(rule)

    section("SUMMARY")
    story.append(Paragraph(markup(SUMMARY), style["body"]))
    section("TECHNICAL SKILLS")
    for label, items in PROFILES[profile]["skills"]:
        story.append(Paragraph(f"<b>{markup(label)}:</b> {markup(items)}", style["body"]))
    section("EXPERIENCE")
    story.append(Paragraph("Independent Software Developer &nbsp;|&nbsp; 2024 - Present", style["role"]))
    for project in projects:
        intro = [
            Paragraph(markup(project["title"]), style["project"]),
            Paragraph(f'{markup(project["relationship"])} &nbsp;|&nbsp; {markup(project["date"])}'
                      f' &nbsp;|&nbsp; {link(project["url"])}', style["meta"]),
            Paragraph(markup(project["stack"]), style["meta"]),
            Paragraph(markup(project["bullets"][0]), style["bullet"], bulletText="-"),
        ]
        story.append(KeepTogether(intro))
        story.append(Paragraph(markup(project["bullets"][1]), style["bullet"], bulletText="-"))
        story.append(Spacer(1, 9))
    section("EDUCATION")
    story.append(Paragraph("<b>University of Maryland, College Park</b>", style["body"]))
    story.append(Paragraph("Bachelor of Science, Computer Science &nbsp;|&nbsp; December 2022",
                           style["body"]))
    return story


def validate_pdf(path: Path, projects):
    reader = PdfReader(path)
    if len(reader.pages) != 1:
        raise RuntimeError(f"Resume must fit on one page; produced {len(reader.pages)}. "
                           "Edit the selected content before reducing type size.")
    page = reader.pages[0]
    if tuple(float(v) for v in page.mediabox[2:]) != LETTER:
        raise RuntimeError("Resume must use a US Letter page")
    text = " ".join(page.extract_text().split())
    expected_order = ["TO YIN YU", "SUMMARY", "TECHNICAL SKILLS", "EXPERIENCE"]
    expected_order += [p["title"] for p in projects]
    expected_order += ["EDUCATION", "University of Maryland, College Park", "December 2022"]
    cursor = 0
    for phrase in expected_order:
        position = text.find(phrase, cursor)
        if position == -1:
            raise RuntimeError(f"Missing or out-of-order resume text: {phrase}")
        cursor = position + len(phrase)
    for phrase in ["(206) 712-5144", "Independent Software Developer", "2024 - Present"] + [
        b for p in projects for b in p["bullets"]
    ]:
        if " ".join(phrase.split()) not in text:
            raise RuntimeError(f"Resume text did not extract intact: {phrase}")
    links = []
    for annotation in page.get("/Annots", []):
        action = annotation.get_object().get("/A", {})
        if action.get("/URI"):
            links.append(str(action["/URI"]))
    expected_links = {url for url, _ in CONTACT_LINKS} | {p["url"] for p in projects}
    if set(links) != expected_links:
        raise RuntimeError("Resume link targets do not match the selected source records")
    return {"pages": 1, "words": len(text.split()), "links": len(links)}


def main(out_path: str, profile: str = "default"):
    projects = load_resume_projects(profile)
    destination = Path(out_path).resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(prefix=f".{destination.stem}.", suffix=".pdf",
                                     dir=destination.parent, delete=False) as temporary:
        staging = Path(temporary.name)
    try:
        document = SimpleDocTemplate(
            str(staging), pagesize=LETTER, leftMargin=0.55 * inch, rightMargin=0.55 * inch,
            topMargin=0.45 * inch, bottomMargin=0.45 * inch,
            title="To Yin Yu - Resume", author="To Yin Yu", invariant=1,
        )
        document.build(build_story(projects, profile))
        checks = validate_pdf(staging, projects)
        staging.chmod(0o644)
        os.replace(staging, destination)
        return checks
    finally:
        staging.unlink(missing_ok=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", nargs="?", default=str(ROOT / "public" / "resume.pdf"))
    parser.add_argument("--profile", choices=PROFILES, default="default")
    args = parser.parse_args()
    checks = main(args.output, args.profile)
    print(f"Wrote {args.output} ({args.profile}; {checks['pages']} page; {checks['words']} words)")
