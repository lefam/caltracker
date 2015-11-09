var fs = require('fs');

/*
 * Initializes all models and sources them as .model-name
 * Inspired by http://stackoverflow.com/a/32683879/923342
 */
fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    exports[moduleName] = require('./' + moduleName);
  }
});