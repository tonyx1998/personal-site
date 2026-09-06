.PHONY: setup dev build test lint verify resume

PYTHON ?= python3

setup:
	mise install 2>/dev/null || true
	cp -n .env.example .env 2>/dev/null || true
	npm ci
	direnv allow 2>/dev/null || true

dev:
	npm run dev

build:
	npm run build

test:
	npm test

lint:
	npm run lint

verify:
	@test -f .env || (echo "Run: cp .env.example .env" && exit 1)
	@command -v node >/dev/null
	npm run lint
	npm test
	npm run format:check

# Regenerate public/resume.pdf from the shared source (src/lib/projects.data.json).
resume:
	$(PYTHON) scripts/build-resume.py public/resume.pdf
