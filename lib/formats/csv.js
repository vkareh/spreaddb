var csv = require('csv');
var fs = require('fs');
var _ = require('underscore');

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
  CSV.read(filename, function(err, data) {
    if (err) return callback(err);
    var options;
    if (data.length === 0) options = {columns: _.keys(_.first(rows)), header: true, eof: true};
    else options = {eof: true, flags: 'a+'};

    csv()
    .from(rows)
    .to.path(filename, options)
    .on('close', function(count) {
      callback(null, {ok: true});
    })
    .on('error', function(err) {
      callback(err);
    });
  });
};

CSV.remove = function(filename, rowId, callback) {
  var columns = [];
  csv()
  .from.path(filename, {columns: true})
  .to.array(function(data) {
    csv()
    .from(data)
    .to.path(filename, {columns: columns, header: true, eof: true})
    .on('close', function() {
      callback(null, {ok: true});
    })
    .on('error', function(err) {
      callback(err);
    });
  })
  .transform(function(row, index) {
    columns = _.union(columns, _.keys(row));
    if (_.values(row)[0] == rowId) return null;
    else return row;
  })
  .on('error', function(err) {
    callback(err);
  });
};

module.exports = CSV;
