var fs = require('fs');
var path = require('path');
var Spreadsheet = require('./spreadsheet');

var spreaddb = global.spreaddb;

fs.readdir(spreaddb.directory, function(err, files) {
  if (err) return console.error(err);

  spreaddb.files = [];
  files.forEach(function(filename) {
    var spreadsheet = new Spreadsheet({filename: filename});

    spreadsheet.stats(function(err, stats) {
      if (err) {
        if (process.env.NODE_ENV !== 'production') console.error(err, filename);
      } else {
        spreaddb.files.push(stats);
      }
    });
  });
});
