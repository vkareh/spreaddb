var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var Format = require('./format');

var config = require('./config');

var Spreadsheet = function(options) {
  this.filename = options.filename;
  this.path = path.join(config.directory, this.filename);
  this.format = new Format(options);
  this.rows = options.rows || [];
};

Spreadsheet.prototype.exists = function(callback) {
  fs.exists(this.path, callback);
};

Spreadsheet.prototype.has = function(id, callback) {
  var spreadsheet = this;
  this.read(id, function(err, data) {
    callback(err, !_.isEmpty(data));
  });
};

Spreadsheet.prototype.stats = function(callback) {
  var spreadsheet = this;
  var stats = {
    filename: spreadsheet.filename,
    format: spreadsheet.format.format
  };

  fs.stat(path.join(config.directory, this.filename), function(err, data) {
    if (err) return callback(err);
    stats.size = data.size;
    stats.updated = data.mtime;

    spreadsheet.read(function(err, data) {
      if (err) return callback(err);
      stats.records = _.size(data);

      callback(null, stats);
    });
  });
};

Spreadsheet.prototype.create = function(rows, callback) {
  if (typeof rows === 'function') {
    callback = rows;
    rows = this.rows || [];
  }

  var spreadsheet = this;
  var format = this.format;

  spreadsheet.exists(function(exists) {
    if (exists) return callback(new Error('Spreadsheet already exists'));

    format.create(function(err, status) {
      if (err) return callback(err);
      if (rows.length === 0) return callback(null, status);

      spreadsheet.add(rows, function(err, status) {
        if (err) callback(err);
        else callback(null, status);
      });
    });
  });
};

Spreadsheet.prototype.destroy = function(callback) {
  var spreadsheet = this;
  fs.unlink(path.join(config.directory, spreadsheet.filename), function(err) {
    if (err) callback(err);
    else callback(null, {ok: true});
  });
};

Spreadsheet.prototype.read = function(query, callback) {
  if (typeof query === 'function') {
    callback = query;
    query = {};
  } else if (typeof query === 'string') {
    query = {_id: query};
  }

  var spreadsheet = this;
  var format = this.format;

  format.read(function(err, data) {
    if (err) return callback(err);

    spreadsheet.filter(data, query, function(err, data) {
      if (err) callback(err);
      else callback(null, data);
    });
  });
};

var filters = [ '_id', 'skip', 'limit', 'sort', 'reverse', 'columns' ];
Spreadsheet.prototype.filter = function(data, options, callback) {
  if (_.isEmpty(options)) return callback(null, data);

  var query = _.omit(options, filters);
  if (!_.isEmpty(query)) data = _.where(data, query);

  _.each(filters, function(filter) {
    if (!_.has(options, filter)) return false;

    switch (filter) {
      case '_id':
        var query = {};
        var idAttr = _.keys(data[0])[0];

        query[idAttr] = options._id;
        data = _.where(data, query);
        break;
      case 'skip':
        data = _.rest(data, parseInt(options.skip));
        break;
      case 'limit':
        data = _.first(data, parseInt(options.limit));
        break;
      case 'sort':
        data = _.sortBy(data, options.sort);
        break;
      case 'reverse':
        if (options.reverse === true) {
          data = data.reverse();
        }
        break;
      case 'columns':
        if (_.isArray(options.columns)) {
          data = _.map(data, function(row) {
            return _.pick(row, options.columns);
          });
        }
        break;
    }
  });

  callback(null, data);
};

Spreadsheet.prototype.remove = function(rowId, callback) {
  this.format.remove(rowId, function(err, status) {
    if (err) callback(err);
    else callback(null, status);
  });
};

Spreadsheet.prototype.add = function(rows, callback) {
  if (!_.isArray(rows)) rows = [rows];

  this.format.add(rows, function(err, status) {
    if (err) callback(err);
    else callback(null, status);
  });
};

module.exports = Spreadsheet;
