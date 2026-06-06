.PHONY: setup dev build test lint verify

setup:
	mise install 2>/dev/null || true
	cp -n .env.example .env 2>/dev/null || true
	npm ci

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
