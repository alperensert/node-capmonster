build: 
	npm run build

ci: 
	npm ci

install:
	npm install

publish:
	npm publish

test: 
	npm test js-tests/*.js

prepare-test:
	tsc tests/*.ts --declaration --outDir js-tests