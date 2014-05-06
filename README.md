# lazy-packages

> lazy-packages is a Meteor package, enabling the lazy-loading of Meteor packages

## Installation

lazy-packages is not currently on atmosphere.  To install it do the following:

```bash
mkdir packages
git clone https://github.com/mystor/meteor-lazy-packages packages/lazy-packages
meteor add lazy-packages
```

## Usage

### Choosing which packages to lazy-load
To use lazy-packages, simply add a file with the extension `.lazypkgs.yml`.  This is a yaml file which describes lazy packages to enable loading for.

When this file is compiled, it will compile the packages with those names, and will make them avaliable to the client.

The packages which you lazy-load should NOT be added to your Meteor project, otherwise they will be loaded non-lazily, and when they are loaded lazily, they will be loaded twice.

An example lazy-packages file is below:
```yaml
# main.lazypkgs.yml

minify: true  # If the minify option is set to true, the package will be minified before it is served.
packages:  # You want to list the packages to lazily load below
    - 'package-one'
    - 'package-two'
    - 'package-three'
```

### Lazily loading a package
To load a package on the client, do the following:
```javascript
LazyPackages.load('package-name');
```

This will load all of the javascript and css for the package. Calling this function multiple times with the same package will have no effect.

On the server, packages are not lazily loaded. Any JS and CSS assets will simply be added to the project.

## Limitations
- Packages can add more resource types than just JS and CSS (such as document fragments).  This is currently not supported, and will display a warning.

- When a package which is being lazily loaded is edited, it will not be recompiled. The project needs to update in some other way before the code is recompiled.

## Contributing
lazy-packages is still very much a work in progress. If you find bugs or unexpected behaviour, please report them. If you find a fix to a problem, please submit a pull request. I really appreciate it.

## License

(The MIT License)

Copyright (c) 2013 Michael Layzell

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

