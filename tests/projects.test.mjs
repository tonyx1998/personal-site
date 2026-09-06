import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import {
  projects,
  selectedProjects,
  supportingProjects,
  homepageSupportingProjects,
  projectBySlug,
  projectSlug,
} from "../src/lib/projects.ts";

// These URLs were public before the homepage was curated. Demoting a project
// must not remove its detail page, sitemap entry, or archive membership.
const publishedSlugs = [
  "hows-my-job-fit",
  "solomock",
  "gasolytics-us-gas-price-map",
  "soloyap",
  "amex-roofing-site-ai-booking-agent",
  "reachspan",
  "throughline-technical-learning-ecosystem",
  "all-in-one-url",
  "programming-basics",
  "modern-web-dev-guide",
  "modern-ai-guide",
  "modern-security-engineer-guide",
  "modern-cloud-engineer-guide",
  "modern-data-engineering-guide",
  "shipyard",
  "swe-interview-guide",
  "2026-skills-roadmap",
];

test("curation preserves the published route set and hidden launch state", () => {
  const slugs = projects.map(projectSlug);
  assert.deepEqual([...slugs].sort(), [...publishedSlugs].sort());
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(projectBySlug("plugrade"), null);
  assert.equal(projectBySlug("missing-project"), null);
  for (const slug of publishedSlugs) assert.ok(projectBySlug(slug), slug);
});

test("primary and compact homepage selections do not change the archive", () => {
  assert.deepEqual(selectedProjects.map(projectSlug), [
    "amex-roofing-site-ai-booking-agent",
    "solomock",
    "gasolytics-us-gas-price-map",
  ]);
  assert.deepEqual(homepageSupportingProjects.map(projectSlug), [
    "hows-my-job-fit",
    "soloyap",
    "reachspan",
    "throughline-technical-learning-ecosystem",
  ]);
  assert.equal(supportingProjects.length, 14);
  assert.ok(
    homepageSupportingProjects.every((project) =>
      supportingProjects.includes(project)
    )
  );
  assert.ok(
    selectedProjects.every(
      (project) => !homepageSupportingProjects.includes(project)
    )
  );
  assert.deepEqual(
    new Set([...selectedProjects, ...supportingProjects]),
    new Set(projects)
  );
});

test("selected studies have complete content and correctly sized evidence assets", () => {
  for (const project of selectedProjects) {
    const study = project.caseStudy;
    assert.ok(study, project.title + " needs a case study");
    for (const field of ["role", "context", "summary", "evidenceNote"]) {
      assert.ok(study[field]?.trim(), project.title + ": " + field);
    }
    assert.ok(study.sections.length >= 3);
    assert.equal(
      new Set(study.sections.map((section) => section.title)).size,
      study.sections.length
    );
    for (const section of study.sections) {
      assert.ok(section.title.trim());
      assert.ok(
        section.paragraphs.length &&
          section.paragraphs.every((text) => text.trim())
      );
    }
    const figures = study.sections.flatMap((section) =>
      section.figure ? [section.figure] : []
    );
    assert.equal(
      figures.length,
      2,
      project.title + " needs its result and detail evidence"
    );
    assert.equal(figures[0].width, 1280);
    assert.equal(figures[0].height, 720);
    for (const figure of figures) {
      assert.ok(figure.alt.trim() && figure.caption.trim());
      assert.ok(figure.src.startsWith("/projects/evidence/"));
      const path = new URL("../public" + figure.src, import.meta.url);
      assert.ok(existsSync(path), figure.src);
      const bytes = readFileSync(path);
      assert.equal(bytes.subarray(1, 4).toString(), "PNG", figure.src);
      assert.equal(bytes.readUInt32BE(16), figure.width, figure.src + " width");
      if (figure.originalSrc) {
        assert.ok(
          figure.originalSrc.startsWith("/projects/evidence/originals/")
        );
        const original = readFileSync(
          new URL("../public" + figure.originalSrc, import.meta.url)
        );
        assert.equal(original.readUInt32BE(16), figure.width * 2);
        assert.equal(original.readUInt32BE(20), figure.height * 2);
      }
      assert.equal(
        bytes.readUInt32BE(20),
        figure.height,
        figure.src + " height"
      );
    }
  }
});

test("every published destination has a safe URL and local tools stay local", () => {
  for (const project of projects) {
    for (const url of [project.live, project.github].filter(Boolean)) {
      assert.equal(new URL(url).protocol, "https:", project.title);
    }
  }
  assert.equal(projectBySlug("shipyard").live, null);
});
