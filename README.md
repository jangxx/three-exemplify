# three-exemplify
This module simplifies the inclusion of those parts of three.js, which are hidden in the examples/ directory and incompatible with module systems.

## Installation

	npm i -D three-exemplify

## Usage

Enable the transform like this:

```javascript
browserify().transform("three-exemplify", { global: true })
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

## How does it work

The transform works by wrapping each of the examples in a function:

```javascript
module.exports = function(THREE) {
	// ...content of the file...
};
```

The three.js examples all rely on global namespace pollution to extend a global `THREE` object.
This transform turns each of the examples into a function, which takes a `THREE` object as input an then attaches new properties to that one, instead of a global one.