const through = require('through2');

module.exports = function(file) {
	if (file.indexOf("/three/examples/") == -1) {
		return through();
	} else {
		let first_chunk = true;

		return through(function(chunk, enc, next) {
			if (first_chunk) {
				this.push("module.exports = function(THREE) {"); // prepend function header to file
				first_chunk = false;
			}
			next(null, chunk);
		}, function(next) {
			this.push("};"); // close the function declaration
			next();
		});
	}           
};