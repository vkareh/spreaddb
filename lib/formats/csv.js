var csv = require('csv');

var CSV = {};

CSV.data = function(filename, callback) {
    csv()
    .from.path(filename, {columns: true})
    .to.array(function(data) {
        callback(null, data);
    })
    .on('error', function(err) {
        callback(err);
    });
};

CSV.addRows = function(filename, rows, callback) {
    csv()
    .from(rows, {columns: true})
    .to(filename, {flags: 'a', eof: true})
    .on('finish', function(count) {
        callback(null, {ok: true});
    })
    .on('error', function(err) {
        callback(err);
    });
};

module.exports = CSV;
