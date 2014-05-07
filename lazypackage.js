var packages = {};

LazyPackage = {
  // Loads the package with the name pkg.  If the callback
  // is specified, calls the callback when all scripts
  // provided by the package have been loaded. If a package
  // has no scripts, or the page has already been loaded,
  // callback is called immediately.
  load: function(pkg, callback) {
    // Call the callback if the package has already been
    // fully loaded.
    if (packages[pkg].fullyLoaded && typeof callback !== 'undefined')
      callback();

    // Record the callback
    packages[pkg].callbacks = packages[pkg].callbacks || [];
    if (typeof callback !== 'undefined')
      packages[pkg].callbacks.push(callback);

    // If we have started loading the package, don't do it again
    if (packages[pkg].loaded)
      return;

    // Mark the package such that we can't load it again
    packages[pkg].loaded = true;

    // Keeping track of loading progress
    var loaded = 0;
    var target = 0;

    _.each(packages[pkg].js, function(jsURI) {
      // Keep track of if the script has been loaded
      var done = false;
      target++;

      // Configure the script
      var script = document.createElement('script');
      script.async = false;
      script.setAttribute('type', 'text/javascript');

      script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState
                      || this.readyState === 'loaded'
                      || this.readyState === 'complete')) {
          // Mark this script as loaded
          done = true;
          loaded++;

          // Call the callbacks
          if (loaded >= target) {
            packages[pkg].fullyLoaded = true;
            _.each(packages[pkg].callbacks, function(callback) {
              callback();
            });
          }

          // Clean some stuff up (this may be a memory leak in older versions of IE)
          script.onload = script.onreadystatechange = null;
          document.body.removeChild(script);
        }
      }

      // Add the src attribute, and add it to the body
      script.setAttribute('src', Meteor.absoluteUrl(jsURI));
      document.body.appendChild(script);
    });

    _.each(packages[pkg].css, function(cssURI) {
      // Load the CSS by adding it to the document
      var link = document.createElement('link');
      document.head.appendChild(link);
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', Meteor.absoluteUrl(cssURI));
    });

    // Check if we have already loaded all of the JS (this probably means there was none)
    if (loaded >= target) {
      packages[pkg].fullyLoaded = true;
      _.each(packages[pkg].callbacks, function(callback) {
        callback();
      })
    }
  },

  _register: function(config) {
    _.defaults(packages, config);
  }
};

