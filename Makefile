run:
	npx webpack serve
	
install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .
lint-fix:
	npx eslint . --fix

.PHONY: test