Package.describe({
  summary: 'Lazily load Meteor packages'
});

Package._transitional_registerBuildPlugin({
  name: 'compileLazyPackage',
  use: [],
  sources: [
    'plugin/compileLazyPackage.js'
  ],
  npmDependencies: {}
});

Package.on_use(function(api) {
  api.add_files('lazypackage.js', 'client');

  api.export('LazyPackage', 'client');
});

