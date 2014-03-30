var xlsx = require('xlsx');
var writer = require('xlsx-writer');
var _ = require('underscore');

var XLSX = {};

XLSX.create = function(filename, rows, callback) {
  if (typeof rows === 'function') {
    callback = rows;
    rows = [];
  }

  writer.write(filename, rows, function (err) {
    if (err) callback(err);
    else callback(null, {ok: true});
  });
};

XLSX.read = function(filename, callback) {
  var file = xlsx.readFile(filename);
  var sheet = file.Sheets[file.SheetNames[0]];
  var data = xlsx.utils.sheet_to_row_object_array(sheet);

  callback(null, data);
};

XLSX.add = function(filename, rows, callback) {
  if (!_.isArray(rows)) rows = [rows];
  XLSX.read(filename, function(err, data) {
    if (err) return callback(err);
    XLSX.create(filename, data.concat(rows), function(err, status) {
      callback(err, status);
    });
  });
};

XLSX.remove = function(filename, rowId, callback) {
  XLSX.read(filename, function(err, data) {
    if (err) return callback(err);
    data = _.reject(data, function(row) {
      return _.values(row)[0] == rowId;
    });
    XLSX.create(filename, data, function(err, status) {
      callback(err, status);
    });
  });
};

module.exports = XLSX;
