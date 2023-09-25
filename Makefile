# install:
# 	npm ci

# lint:
# 	npx eslint .

# lint-fix:
# 	npx eslint . --fix

# run:
# 	npx webpack serve

# test:
# 	npm run test

# build:
# 	NODE_ENV=production npx webpack

# build:
# 	npm run build

develop:
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

.PHONY: test