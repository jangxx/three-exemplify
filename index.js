const through = require('through2');
const path = require('path');

module.exports = function(file) {
	if (file.indexOf(`${path.sep}three${path.sep}examples${path.sep}`) == -1) {
		return through();
	} else {
		let first_chunk = true;

		return through(function(chunk, enc, next) {
			if (first_chunk) {
				this.push("module.exports = function(THREE, extract_variables, insert_variables) {\n"); // prepend function header to file
				
				// prepend code which injects required variables
				this.push("if (insert_variables != undefined && insert_variables instanceof Object) {\n");
				this.push("for(let iv in insert_variables) {\n");
				this.push("eval(`var ${iv} = insert_variables['${iv}'];`);\n");
				this.push("}}\n");
				first_chunk = false;
			}
			next(null, chunk);
		}, function(next) {
			this.push(`if (extract_variables != undefined && extract_variables instanceof Array) {
	let _three_exemplify_result = { THREE };
	for(let v of extract_variables) {
		_three_exemplify_result[v] = eval(v);
	}
	return _three_exemplify_result;
} else {
	return { THREE };
}
};`); // append code which exports extract variables
			next();
		});
	}           
};