Package.describe({
  summary: 'description'
});

Package.on_use(function(api) {
  api.use('less', 'client');

  api.add_files('file.js', 'client');
  api.add_files('file.less', 'client');
});

