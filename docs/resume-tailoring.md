# Resume tailoring

The public resume is a one-page full-stack application resume with Amex Roofing,
SoloMock, and Gasolytics. The complete collection of `resume` records in
`src/lib/projects.data.json` is the editable master. A project's homepage
placement does not determine whether a resume profile selects it.

## Generate a resume

The existing command continues to update `public/resume.pdf`:

```sh
make resume
```

Use a separate output path for a tailored application:

```sh
python3 scripts/build-resume.py /tmp/To-Yin-Yu-Resume-Frontend.pdf --profile frontend
```

The generator needs Python 3.10+ with `reportlab` and `pypdf` installed. If the
configured interpreter is elsewhere, use `make resume PYTHON=/path/to/python3`.
The package resume command uses `python3` from the current environment. In Codex,
the bundled workspace Python provides these dependencies; use its discovered
path as the `PYTHON` override rather than installing into the system interpreter.

The output is written to a staging file beside the destination, checked, and
atomically replaced only after it passes. A failed build preserves the previous
file and removes its staging file. PDF metadata is deterministic, so unchanged
source produces the same artifact.

## Profiles

| Profile    | Project order                       | Emphasis                                       |
| ---------- | ----------------------------------- | ---------------------------------------------- |
| `default`  | Amex → SoloMock → Gasolytics        | Client delivery, realtime apps, data rendering |
| `frontend` | Gasolytics → SoloMock → Throughline | Interactive UI and shared frontend systems     |
| `product`  | Amex → Gasolytics → SoloMock        | Useful flows and product delivery              |
| `ai`       | SoloMock → Gasolytics → Amex        | Realtime AI interaction plus web engineering   |
| `backend`  | all-in-one-URL → Amex → SoloMock    | Data services, auth, APIs, integrations        |

The AI profile leads with SoloMock's OpenAI Realtime API work. It does not imply
that every selected project uses AI, claim Claude API experience, or describe
Amex's disputed AI chat feature. Job Fit stays outside these presets until its
current runtime and precise document-privacy wording are reconciled. Role
profiles adapt the selection and skills, not the underlying facts. They are
starting points for a real posting, not a guarantee of suitability for every
role with that label.

## Edit the master

Edit project facts only in `src/lib/projects.data.json`. Selected records use:

- `resume.id`: a unique, stable selector such as `amex-roofing`; it does not change
  the project's public URL.
- `resume.relationship`: `Client project` or `Independent product`.
- `resume.title`, `resume.date`, `resume.stack`, and exactly two `resume.bullets`.
  Existing HTML entities are accepted as text; formatting markup is not needed.
- The parent project's `live` link, falling back to `github`. The displayed link
  and PDF annotation derive from that URL, not a separate HTML override.

The generator's `PROFILES` contains presentation choices: project IDs in order,
role headings, and skills emphasis. It does not duplicate project bullets.
Existing master entries can remain unselected. `resume.order` is legacy master
metadata; the explicit profile order controls the PDF. Hidden, missing, or
incomplete selected records cause the build to fail.

Keep the independent role accurate. Amex appears as a client project under
independent development; no employment relationship, paid contract, or new title
at Amex is inferred. Keep existing year dates until exact dates are supported.
Do not add problem counts from a different SoloMock version, hard global cost-cap
claims, Amex Solar/AI-chat claims, blanket Job Fit “stores nothing” language, or
unmeasured business results.

## Layout and checks

The document uses one Letter page, a single reading column, 10.5 pt body text
with 13.5 pt leading, and explicit separation between projects. Contact details
are unchanged. The summary can occupy three lines. If new content overflows,
edit the copy or project selection before reducing the type size.

Every generation checks page size/count, text presence and reading order,
complete project bullets, and the expected link destinations. These are document
checks, not an ATS score or a universal parsing guarantee. They do not test the
availability or functionality of external sites.

Run the focused regression checks after generator or profile changes:

```sh
python3 -m unittest discover -s scripts -p 'test_resume.py'
```

After factual or visual changes, render and inspect the entire produced page at
a normal reading size. Check bold weights, line breaks, metadata, links, and the
absence of clipping. Inspect the chosen profile rather than assuming that a
successful default render proves every variation. Use the existing website's
`/resume.pdf` link for the public version; keep tailored PDFs separate. Update
`HANDOVER.md` alongside source changes as required by the repository.
