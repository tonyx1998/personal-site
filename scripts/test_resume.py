"""Regression checks for resume selection and safe PDF replacement."""

import importlib.util
from html.parser import HTMLParser
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject

spec = importlib.util.spec_from_file_location(
    "build_resume", Path(__file__).with_name("build-resume.py")
)
resume = importlib.util.module_from_spec(spec)
spec.loader.exec_module(resume)


class BodyText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_body = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "body":
            self.in_body = True

    def handle_endtag(self, tag):
        if tag == "body":
            self.in_body = False

    def handle_data(self, data):
        if self.in_body:
            self.parts.append(data)


def compact(text):
    return "".join(text.split())


class ResumeTests(unittest.TestCase):
    def test_default_is_three_client_and_product_examples(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "resume.pdf"
            resume.main(str(destination))
            reader = PdfReader(destination)
            self.assertEqual(len(reader.pages), 1)
            text = reader.pages[0].extract_text()
            names = ["Amex Roofing", "SoloMock", "Gasolytics"]
            positions = [text.index(name) for name in names]
            self.assertEqual(positions, sorted(positions))
            self.assertIn("Client project", text)
            self.assertIn("Independent Software Developer", text)
            self.assertNotIn("How's My Job Fit?", text)
            self.assertNotIn("Throughline", text)
            self.assertNotIn("AI Booking Agent", text)
            self.assertNotIn("15 structured", text)
            self.assertNotIn("40 briefs", text)
            self.assertEqual(text.count("EXPERIENCE"), 1)
            first_build = destination.read_bytes()
            resume.main(str(destination))
            self.assertEqual(destination.read_bytes(), first_build)

    def test_all_presets_fit_and_keep_source_links(self):
        with tempfile.TemporaryDirectory() as directory:
            for profile in resume.PROFILES:
                with self.subTest(profile=profile):
                    destination = Path(directory) / f"{profile}.pdf"
                    checks = resume.main(str(destination), profile)
                    self.assertEqual(checks["pages"], 1)
                    self.assertEqual(checks["links"], 7)
                    self.assertEqual(len(checks["tagged_links"]), 7)
                    self.assertGreater(checks["marked_content"], 40)
                    body = BodyText()
                    body.feed(resume.build_html(resume.load_resume_projects(profile), profile))
                    self.assertEqual(compact(checks["reading_order"]), compact("".join(body.parts)))
                    if profile == "backend":
                        text = PdfReader(destination).pages[0].extract_text()
                        self.assertIn("all-in-one-URL", text)

    def test_rejected_overflow_preserves_existing_file_and_cleans_staging(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "resume.pdf"
            previous = b"previous reviewed artifact"
            destination.write_bytes(previous)
            overflow = '<p>First page</p><p style="break-before: page">Second page</p>'
            with patch.object(resume, "build_html", return_value=overflow):
                with self.assertRaisesRegex(RuntimeError, "one page; produced 2"):
                    resume.main(str(destination))
            self.assertEqual(destination.read_bytes(), previous)
            self.assertEqual(list(Path(directory).iterdir()), [destination])

    def test_structural_regressions_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "resume.pdf"
            resume.main(str(source))
            for defect in ("language", "structure", "link", "font", "reading_order"):
                with self.subTest(defect=defect):
                    writer = PdfWriter(clone_from=source)
                    root = writer.root_object
                    if defect == "language":
                        root[NameObject("/Lang")] = TextStringObject("")
                    elif defect == "structure":
                        del root["/StructTreeRoot"]
                    elif defect == "link":
                        del writer.pages[0]["/Annots"][0].get_object()["/StructParent"]
                    elif defect == "font":
                        font = next(iter(writer.pages[0]["/Resources"]["/Font"].values())).get_object()
                        del font["/ToUnicode"]
                    else:
                        document = root["/StructTreeRoot"]["/K"][0].get_object()
                        document["/K"].reverse()
                    broken = Path(directory) / "broken.pdf"
                    writer.write(broken)
                    with self.assertRaises((RuntimeError, KeyError)):
                        resume.validate_pdf(broken, resume.load_resume_projects())

    def test_committed_public_resume_has_current_facts_and_structure(self):
        checks = resume.validate_pdf(resume.ROOT / "public" / "resume.pdf",
                                     resume.load_resume_projects())
        body = BodyText()
        body.feed(resume.build_html(resume.load_resume_projects()))
        self.assertEqual(compact(checks["reading_order"]), compact("".join(body.parts)))

    def test_incomplete_or_hidden_selection_fails_before_output(self):
        records = json.loads(resume.PROJECTS_JSON.read_text())
        amex = next(p for p in records if p.get("resume", {}).get("id") == "amex-roofing")
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "projects.json"
            amex["hidden"] = True
            source.write_text(json.dumps(records))
            with self.assertRaisesRegex(ValueError, "hidden project"):
                resume.load_resume_projects(data_path=source)
            amex["hidden"] = False
            amex["resume"]["bullets"] = []
            source.write_text(json.dumps(records))
            with self.assertRaisesRegex(ValueError, "two approved bullets"):
                resume.load_resume_projects(data_path=source)


if __name__ == "__main__":
    unittest.main()
