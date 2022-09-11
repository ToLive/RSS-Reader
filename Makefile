start:
	npx webpack serve

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

lint:
	npx eslint .

test-coverage:
	npm test -- --coverage --passWithNoTests --coverageProvider=v8

.PHONY: test