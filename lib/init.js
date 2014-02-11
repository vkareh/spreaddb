var fs = require('fs'),
    path = require('path'),
    Spreadsheet = require('./spreadsheet').Spreadsheet;

var spreaddb = global.spreaddb;

fs.readdir(spreaddb.directory, function(err, files) {
    if (err) return console.error(err);

    spreaddb.files = [];
    files.forEach(function(file) {
        var spreadsheet = new Spreadsheet(path.join(spreaddb.directory, file));

        spreadsheet.stats(function(err, stats) {
            if (err) {
                if (process.env.NODE_ENV !== 'production') console.error(err, file);
            } else {
                spreaddb.files.push(stats);
            }
        });
    });
});
