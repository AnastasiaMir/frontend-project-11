install:
	npm ci

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

run:
	npm start

test:
	npm run test