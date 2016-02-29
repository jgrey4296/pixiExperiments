all : doc
	-r.js -o minifyData.js

doc :
	-rm -r docs
	jsdoc ./src -r -d ./docs
