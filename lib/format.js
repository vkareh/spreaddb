var fs = require('fs');
var path = require('path');

var config = require('../config.json');
config.directory = require('path').resolve(config.directory);

var Format = function(options) {
  this.filename = path.join(config.directory, options.filename);
  if (options.format) this.format = options.format;
  else this.format = path.extname(this.filename).substr(1);
};

Format.formats = {
  csv: require('./formats/csv'),
  xls: require('./formats/xlsx'),
  xlsx: require('./formats/xlsx')
};

Format.prototype.supported = function(callback) {
  var supported = Format.formats.hasOwnProperty(this.format);
  if (typeof callback === 'function') {
    return callback(null, supported);
  }
  return supported;
};

Format.prototype.create = function(callback) {
  Format.formats[this.format].create(this.filename, function(err, status) {
    if (err) callback(err);
    else callback(null, status);
  });
};

Format.prototype.read = function(filename, callback) {
  if (typeof filename === 'function') {
    callback = filename;
    filename = this.filename;
  } else {
    filename = path.join(config.directory, filename);
  }

  if (!filename) return callback(new Error('No filename specified'));
  if (!this.supported()) return callback(new Error('Unsupported file format'));

  Format.formats[this.format].read(filename, function(err, data) {
    if (err) return callback(err);
    callback(null, data);
  });
};

Format.prototype.add = function(rows, callback) {
  if (!this.filename) return callback(new Error('No filename specified'));
  if (!this.supported()) return callback(new Error('Unsupported file format'));

  Format.formats[this.format].add(this.filename, rows, function(err, status) {
    if (err) callback(err);
    else callback(null, status);
  });
};

Format.prototype.remove = function(rowId, callback) {
  Format.formats[this.format].remove(this.filename, rowId, function(err, status) {
    if (err) callback(err);
    else callback(null, status);
  });
};

module.exports = Format;
