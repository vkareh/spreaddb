var fs = require('fs');
var path = require('path');
var Spreadsheet = require('./spreadsheet');
var formats = require('./format').formats;
var _ = require('underscore');
var config = require('./config');

var init = {};

init.indexFiles = function(callback) {
  fs.readdir(config.directory, function(err, files) {
    if (err) return callback(err);

    // Only read supported files
    files = _.reject(files, function(file) {
      return formats.hasOwnProperty(path.extname(file).substr(1)) > -1;
    });
    if (files.length === 0) return callback(null, []);

    var remaining = files.length;
    files.forEach(function(filename) {
      var spreadsheet = new Spreadsheet({filename: filename});

      spreadsheet.stats(function(err, stats) {
        if (!err) config.files.push(stats);
        if (--remaining === 0) callback(null, config.files);
      });
    });
  });
};

module.exports = init;
