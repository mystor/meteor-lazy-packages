Package.describe({
  summary: 'Lazily load Meteor packages'
});

Package._transitional_registerBuildPlugin({
  name: 'compileLazyPackage',
  sources: [
    'plugin/compileLazyPackage.js'
  ],
  npmDependencies: { 'js-yaml': '3.0.1' }
});

Package.on_use(function(api) {
  api.add_files('lazypackage.js', 'client');

  api.export('LazyPackage', 'client');
});

