# three-exemplify
This module simplifies the inclusion of those parts of three.js, which are hidden in the examples/ directory and incompatible with module systems.

## Installation

	npm i -D three-exemplify

## Usage

Enable the transform like this:

```javascript
browserify("entry.js").transform("three-exemplify", { global: true })
```

or via the command line

	browserify ... -t three-exemplify --global ...

Having the transform run as a global transform is important, otherwise is only runs on your own files and doesn't do anything.

After you have enabled the transform, you can include additional three.js modules as follows:

```javascript
const THREE = require('three');
require('three/examples/js/loaders/SVGLoader')(THREE);

// THREE.SVGLoader is now available
```

Some examples contain standalone classes, like `SimplexNoise`, which are not attached to the global `THREE` object.
To extract these from the example file, add an array of strings as the second parameter:

```javascript
const THREE = require('three');
let { SimplexNoise } = require('three/examples/SimplexNoise')(THREE, [ "SimplexNoise" ]);

// SimplexNoise is now available
```

If you have to inject variables into a file (like the aforementioned `SimplexNoise` for example), you can use the third parameter like this:

```javascript
const THREE = require('three');
let { SimplexNoise } = require('three/examples/SimplexNoise')(THREE, [ "SimplexNoise" ]);

require('three/examples/postprocessing/SSAOPass')(THREE, null, { SimplexNoise });
// THREE.SSAOPass is available without throwing an error
```

## How does it work

The transform works by wrapping each of the examples in a function:

```javascript
module.exports = function(THREE, extract_variables, insert_variables) {
	if (insert_variables != undefined && insert_variables instanceof Object) {
		for(let iv in insert_variables) {
			eval(`var ${iv} = insert_variables['${iv}'];`);
		}
	}

	// ...content of the file...

	if (extract_variables != undefined && extract_variables instanceof Array) {
		let _three_exemplify_result = { THREE };
		for(let v of extract_variables) {
			_three_exemplify_result[v] = eval(v);
		}
		return _three_exemplify_result;
	} else {
		return { THREE };
	}
};
```

The three.js examples all rely on global namespace pollution to extend a global `THREE` object.
This transform turns each of the examples into a function, which takes a `THREE` object as input an then attaches new properties to that one, instead of a global one.
It also adds some code to `eval()` strings to read out and inject additional variables.