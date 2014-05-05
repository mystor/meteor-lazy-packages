var packages = {};

LazyPackage = {
  load: function(pkg) {
    if (packages[pkg].loaded) {
      return;
    }

    _.each(packages[pkg].js, function(jsURI) {
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', Meteor.absoluteUrl(jsURI));
      document.body.appendChild(script);
    });

    _.each(packages[pkg].css, function(cssURI) {
      var link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', Meteor.absoluteUrl(cssURI));
      document.head.appendChild(link);
    });

    packages[pkg].loaded = true;
  },

  _register: function(config) {
    _.defaults(packages, config);
  }
};

