"""Build a tagged, single-column resume from the shared project records.

Semantic HTML defines headings, lists, links and reading order. Structural
checks are not a claim of complete PDF/UA conformance or ATS compatibility.
"""

import argparse
from collections import Counter
from copy import copy
from html import escape, unescape
import json
import os
from pathlib import Path
import tempfile
from urllib.parse import urlsplit

from pypdf import PdfReader
from pypdf.generic import ContentStream, NameObject
from weasyprint import HTML

ROOT = Path(__file__).resolve().parent.parent
PROJECTS_JSON = ROOT / "src" / "lib" / "projects.data.json"
LETTER = (612, 792)
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
    return f'<a href="{escape(url, quote=True)}">{markup(label)}</a>'


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


def build_html(projects, profile: str = "default"):
    """Keep facts shared while authoring the semantic order before layout."""
    font_dir = Path(__file__).with_name("fonts")
    for name in ("PublicSans-Regular.ttf", "PublicSans-Bold.ttf"):
        if not (font_dir / name).is_file():
            raise FileNotFoundError(f"Required embedded resume font is missing: {name}")
    parts = [f"""<!doctype html>
<html lang="en-US"><head><meta charset="utf-8">
<title>To Yin Yu - Resume</title><meta name="author" content="To Yin Yu">
<style>
@font-face {{ font-family: 'Public Sans'; src: url('{(font_dir / 'PublicSans-Regular.ttf').as_uri()}'); font-weight: 400; }}
@font-face {{ font-family: 'Public Sans'; src: url('{(font_dir / 'PublicSans-Bold.ttf').as_uri()}'); font-weight: 700; }}
@page {{ size: Letter; margin: .45in .55in; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; font: 10.5pt/13.5pt 'Public Sans'; color: #0a0a0a;
        font-variant-ligatures: none; }}
h1, h2, h3, h4, p, ul {{ margin: 0; }}
h1 {{ font-size: 22pt; line-height: 26pt; font-weight: 700; margin-bottom: 3pt; }}
p {{ margin-bottom: 2pt; }}
.title {{ margin-bottom: 3pt; }}
.contact, .meta {{ font-size: 9.5pt; line-height: 12pt; color: #525252; }}
h2 {{ font-size: 11pt; line-height: 14pt; color: #1f4e6b; margin-top: 10pt;
      margin-bottom: 4pt; padding-bottom: 4pt; border-bottom: .4pt solid #d4d4d8; }}
h3, h4 {{ font-size: 11pt; line-height: 14pt; font-weight: 700; }}
h3 {{ margin-bottom: 9pt; }}
h4 {{ margin-bottom: 2pt; }}
.meta {{ margin-bottom: 3pt; }}
a {{ color: #1f4e6b; text-decoration: underline; }}
.project {{ margin-bottom: 9pt; break-inside: avoid; }}
ul {{ padding-left: 12pt; list-style-type: "-  "; }}
li {{ padding-left: 0; margin-bottom: 2pt; }}
h2, h3, h4, .meta {{ break-after: avoid; }}
</style></head><body>
<h1>TO YIN YU</h1>
<p class="title">{markup(PROFILES[profile]['title'])}</p>
<p class="contact">Lynnwood, WA (Seattle area) &nbsp;|&nbsp; US citizen</p>
<p class="contact">(206) 712-5144 &nbsp;|&nbsp; """
             + " &nbsp;|&nbsp; ".join(link(url, label) for url, label in CONTACT_LINKS)
             + "</p>"]
    parts += ["<section><h2>SUMMARY</h2>", f"<p>{markup(SUMMARY)}</p></section>",
              "<section><h2>TECHNICAL SKILLS</h2>"]
    for label, items in PROFILES[profile]["skills"]:
        parts.append(f"<p><strong>{markup(label)}:</strong> {markup(items)}</p>")
    parts += ["</section><section><h2>EXPERIENCE</h2>",
              "<h3>Independent Software Developer &nbsp;|&nbsp; 2024 - Present</h3>"]
    for project in projects:
        parts += [f'<div class="project"><h4>{markup(project["title"])}</h4>',
                  f'<p class="meta">{markup(project["relationship"])} &nbsp;|&nbsp; '
                  f'{markup(project["date"])} &nbsp;|&nbsp; {link(project["url"])}</p>',
                  f'<p class="meta">{markup(project["stack"])}</p><ul>']
        parts += [f"<li>{markup(bullet)}</li>" for bullet in project["bullets"]]
        parts.append("</ul></div>")
    parts += ["</section><section><h2>EDUCATION</h2>",
              "<p><strong>University of Maryland, College Park</strong></p>",
              "<p>Bachelor of Science, Computer Science &nbsp;|&nbsp; December 2022</p>",
              "</section></body></html>"]
    return "\n".join(parts)


def validate_structure(reader):
    """Check actual tagged content and annotation ownership, not just metadata.

    This intentionally targets our single-page text-only resume, not arbitrary
    PDFs or every PDF/UA requirement. Independent validator/AT review is separate.
    """
    root = reader.trailer["/Root"]
    page = reader.pages[0]
    if root.get("/Lang") != "en-US":
        raise RuntimeError("Resume needs English document language")
    if not root.get("/MarkInfo", {}).get("/Marked") or "/StructTreeRoot" not in root:
        raise RuntimeError("Resume needs a real structure tree")
    if page.get("/Tabs") != "/S":
        raise RuntimeError("Resume tab order must follow the structure")
    tree = root["/StructTreeRoot"]
    numbers = tree["/ParentTree"]["/Nums"]
    parents = dict(zip(numbers[::2], numbers[1::2]))
    page_parents = parents[page["/StructParents"]]
    operations = ContentStream(page["/Contents"], reader, forced_encoding="bytes").operations
    contexts, marked, content_ids = [], [], set()
    show_text = {b"Tj", b"TJ", b"'", b'"'}
    paint = show_text | {b"S", b"s", b"f", b"F", b"f*", b"B", b"B*", b"b", b"b*", b"Do"}
    for args, op in operations:
        if op in {b"BDC", b"BMC"}:
            mcid = args[1].get("/MCID") if op == b"BDC" else None
            contexts.append((args[0], mcid))
            if mcid is not None:
                if mcid in content_ids:
                    raise RuntimeError("Duplicate marked content ID")
                content_ids.add(mcid)
        active = next((value for _, value in reversed(contexts) if value is not None), None)
        if op in paint and active is None and not any(t == "/Artifact" for t, _ in contexts):
            raise RuntimeError("Resume has untagged visible content")
        if op in show_text and any(t == "/Artifact" for t, _ in contexts):
            raise RuntimeError("Resume text must not be hidden as an artifact")
        marked.append((args, op, active))
        if op == b"EMC":
            if not contexts:
                raise RuntimeError("Unbalanced marked content")
            contexts.pop()
    if contexts:
        raise RuntimeError("Unbalanced marked content")

    text_by_id = {}
    for mcid in content_ids:
        stream = ContentStream(None, reader)
        stream.operations = [(args, op) for args, op, active in marked
                             if op not in show_text or active == mcid]
        isolated = copy(page)
        isolated[NameObject("/Contents")] = stream
        text_by_id[mcid] = " ".join(isolated.extract_text().split())

    tags, headings, links, reading, referenced = Counter(), [], [], [], []

    def walk(ref, ancestor=None, parent=None):
        item = ref.get_object()
        if isinstance(item, int):
            if item not in text_by_id:
                raise RuntimeError("Structure references missing marked content")
            if page_parents[item] != parent:
                raise RuntimeError("Marked content parent mapping is broken")
            referenced.append(item)
            text = text_by_id[item]
            if ancestor != "/Lbl":
                reading.append(text)
            return text
        if isinstance(item, list):
            return " ".join(walk(child, ancestor, parent) for child in item)
        if item.get("/Type") == "/OBJR":
            annotation = item["/Obj"]
            if parent is None or parents[annotation["/StructParent"]] != parent:
                raise RuntimeError("Link annotation parent mapping is broken")
            return ""
        tag = item.get("/S")
        if parent is not None and item.get("/P") != parent:
            raise RuntimeError("Structure element parent mapping is broken")
        tags[tag] += 1
        kids = item.get("/K", [])
        if tag == "/LI" and [k.get_object().get("/S") for k in kids] != ["/Lbl", "/LBody"]:
            raise RuntimeError("List items need a label and body")
        if tag == "/L" and (len(kids) != 2 or any(k.get_object().get("/S") != "/LI" for k in kids)):
            raise RuntimeError("Each project needs a two-item semantic list")
        value = walk(kids, tag if tag == "/Lbl" else ancestor, ref)
        if tag in {"/H1", "/H2", "/H3", "/H4"}:
            headings.append((tag, value.strip()))
        if tag == "/Link":
            objects = [k.get_object() for k in kids if isinstance(k.get_object(), dict)
                       and k.get_object().get("/Type") == "/OBJR"]
            if len(objects) != 1 or not value.strip():
                raise RuntimeError("Links need both visible tagged text and an annotation")
            links.append((objects[0]["/Obj"]["/A"]["/URI"], value.strip()))
        return value

    walk(tree["/K"])
    if len(referenced) != len(set(referenced)) or set(referenced) != content_ids:
        raise RuntimeError("Structure must cover all content exactly once")
    if tags["/H1"] != 1 or tags["/H2"] != 4 or tags["/H3"] != 1 or tags["/H4"] != 3:
        raise RuntimeError("Resume heading hierarchy is incomplete")
    if tags["/L"] != 3 or tags["/LI"] != 6 or tags["/LBody"] != 6:
        raise RuntimeError("Resume project bullets must be tagged lists")
    for ref in page["/Resources"]["/Font"].values():
        font = ref.get_object()
        if "Public-Sans" not in str(font.get("/BaseFont", "")):
            raise RuntimeError("Resume must use its bundled Public Sans font")
        if "/ToUnicode" not in font:
            raise RuntimeError("Resume fonts need Unicode mappings")
        faces = font.get("/DescendantFonts", [font])
        for face in faces:
            descriptor = face.get_object()["/FontDescriptor"]
            if not any(key in descriptor for key in ("/FontFile", "/FontFile2", "/FontFile3")):
                raise RuntimeError("Resume fonts must be embedded")
    return {"marked_content": len(content_ids), "headings": headings,
            "tagged_links": links, "reading_order": " ".join(reading)}


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
    structure = validate_structure(reader)
    if {url for url, _ in structure["tagged_links"]} != expected_links:
        raise RuntimeError("Tagged links must match the source destinations")
    expected_headings = [("/H1", "TO YIN YU"), ("/H2", "SUMMARY"),
                         ("/H2", "TECHNICAL SKILLS"), ("/H2", "EXPERIENCE"),
                         ("/H3", "Independent Software Developer | 2024 - Present")]
    expected_headings += [("/H4", p["title"]) for p in projects]
    expected_headings += [("/H2", "EDUCATION")]
    if structure["headings"] != expected_headings:
        raise RuntimeError("Semantic headings do not match resume reading order")
    return {"pages": 1, "words": len(text.split()), "links": len(links), **structure}


def main(out_path: str, profile: str = "default"):
    projects = load_resume_projects(profile)
    destination = Path(out_path).resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(prefix=f".{destination.stem}.", suffix=".pdf",
                                     dir=destination.parent, delete=False) as temporary:
        staging = Path(temporary.name)
    try:
        HTML(string=build_html(projects, profile)).write_pdf(
            staging, pdf_variant="pdf/ua-1", pdf_identifier=b"to-yin-yu-resume",
        )
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
