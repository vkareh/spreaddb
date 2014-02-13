var csv = require('csv'),
    fs = require('fs'),
    _ = require('underscore');

var CSV = {};

CSV.create = function(filename, callback) {
    fs.open(filename, 'wx', function(err, status) {
        if (err) callback(err);
        else callback(null, {ok: true});
    });
};

CSV.read = function(filename, callback) {
    csv()
    .from.path(filename, {columns: true})
    .to.array(function(data) {
        callback(null, data);
    })
    .on('error', function(err) {
        callback(err);
    });
};

CSV.add = function(filename, rows, callback) {
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

CSV.remove = function(filename, rowId, callback) {
    csv()
    .from.path(filename, {columns: true})
    .to(filename, {flags: 'a', eof: true})
    .transform(function(row, index) {
        if (_.values(row)[0] == rowId) return null;
        else return row;
    })
    .on('finish', function() {
        callback(null, {ok: true});
    })
    .on('error', function(err) {
        callback(err);
    });
};

module.exports = CSV;
