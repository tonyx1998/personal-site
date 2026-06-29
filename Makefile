.PHONY: setup dev build test lint verify resume

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
	npm run lint

lint:
	npm run lint

verify:
	@test -f .env || (echo "Run: cp .env.example .env" && exit 1)
	@command -v node >/dev/null
	npm run lint
	npm run format:check

# Regenerate public/resume.pdf from the shared source (src/lib/projects.data.json).
resume:
	python scripts/build-resume.py public/resume.pdf
