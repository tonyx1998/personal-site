"""Regression checks for resume selection and safe PDF replacement."""

import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from pypdf import PdfReader
from reportlab.platypus import PageBreak, Paragraph

spec = importlib.util.spec_from_file_location(
    "build_resume", Path(__file__).with_name("build-resume.py")
)
resume = importlib.util.module_from_spec(spec)
spec.loader.exec_module(resume)


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
                    if profile == "backend":
                        text = PdfReader(destination).pages[0].extract_text()
                        self.assertIn("all-in-one-URL", text)

    def test_rejected_overflow_preserves_existing_file_and_cleans_staging(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "resume.pdf"
            previous = b"previous reviewed artifact"
            destination.write_bytes(previous)
            body = resume.styles()["body"]
            overflow = [Paragraph("First page", body), PageBreak(), Paragraph("Second page", body)]
            with patch.object(resume, "build_story", return_value=overflow):
                with self.assertRaisesRegex(RuntimeError, "one page; produced 2"):
                    resume.main(str(destination))
            self.assertEqual(destination.read_bytes(), previous)
            self.assertEqual(list(Path(directory).iterdir()), [destination])

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
