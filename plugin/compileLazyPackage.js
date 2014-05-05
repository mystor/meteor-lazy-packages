var _ = Npm.require('underscore');
var path = Npm.require('path');
var crypto = Npm.require('crypto');
var release = Npm.require('./release.js');
var unipackage = Npm.require('./unipackage.js');

var library = release.current.library;

var minifiers = unipackage.load({
  library: release.current.library,
  packages: ['minifiers']
}).minifiers;

var cacheBuster = function(src) {
  var shasum = crypto.createHash('sha1');
  shasum.update(src);
  return shasum.digest('hex');
}

var addCacheBuster = function(uri, src) {
  return uri + '?' + cacheBuster(src);
}

var sourceMappingURL = function(uri, sourceMap) {
  return path.join(path.dirname(uri), cacheBuster(sourceMap) + '.map');
}

Plugin.registerSourceHandler('lazypackages', function(compileStep) {
  // A .lazypackages file holds a list of the lazy packages to provide to the client.
  var options = JSON.parse(compileStep.read().toString('utf8'));
  var isBrowser = compileStep.archMatches('browser');
  var config = {};

  _.each(options.packages, function(packageName) {
    // Get the resources for the package
    var pkg = library.get(packageName);
    var slices = pkg.getDefaultSlices(compileStep.arch);
    var resources = _.flatten(_.map(slices, function(slice) {
      return slice.getResources(compileStep.arch);
    }), true);
    
    // Process the resources into ones we can use!
    var js = [];
    var css = [];
    _.each(resources, function(resource) {
      // Strip the leading /
      var uri = resource.servePath.substring(1);

      if (resource.type === 'js') {
        var data = resource.data;

        if (isBrowser) {
          // Add sourcemaps if necessary
          if (resource.sourceMap && !options.minify) {
            var src = data.toString('utf8');
            var smu = sourceMappingURL(uri, resource.sourceMap);
            src += '\n\n//# sourceMappingURL=' + path.basename(smu) + '\n';

            compileStep.addAsset({
              data: new Buffer(resource.sourceMap, 'utf8'),
              path: smu
            });

            data = new Buffer(src, 'utf8');
          }

          // Minify if necessary
          if (options.minify) {
            var src = data.toString('utf8');
            src = minifiers.UglifyJSMinify(src, {
              fromString: true,
              compress: {drop_debugger: false}
            }).code;

            data = new Buffer(src, 'utf8');
          }

          js.push(addCacheBuster(uri, data.toString('utf8')));

          compileStep.addAsset({
            data: data,
            path: uri
          });
        } else {
          // Nothing is lazy on the server - it doesn't make sense
          compileStep.addJavaScript({
            data: data.toString('utf8'),
            sourcePath: uri,
            path: uri,
            sourceMap: resource.sourceMap
          });
        }
      } else if (resource.type === 'css') {
        var data = resource.data;

        if (! isBrowser)
          throw new Error('Cannot serve css to non-browser target');

        if (resource.sourceMap && ! options.minify) {
          var src = data.toString('utf8');
          var smu = sourceMappingURL(uri, resource.sourceMap);
          src += '\n\n/*# sourceMappingURL=' + path.basename(smu) + ' */\n';

          compileStep.addAsset({
            data: new Buffer(resource.sourceMap, 'utf8'),
            path: smu
          });

          data = new Buffer(src, 'utf8');
        }

        if (options.minify) {
          var src = data.toString('utf8');
          src = minifiers.CssTools.minifyCss(src);

          data = new Buffer(src, 'utf8');
        }

        css.push(addCacheBuster(uri, data.toString('utf8')));

        compileStep.addAsset({
          data: data,
          path: uri
        });
      } else {
        console.warn('A package has done goofed'); // TODO: Improve warning
      }
    });

    config[packageName] = {
      js: js,
      css: css
    };
  });

  if (isBrowser) {
    // Tell the client about the packages.
    compileStep.addJavaScript({
      data: 'Package["lazy-packages"].LazyPackage._register(' + JSON.stringify(config) + ');',
      sourcePath: compileStep.inputPath,
      path: compileStep.inputPath + '.js'
    });
  }
});

