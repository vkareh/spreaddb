var path = require( 'path'),
    fs = require('fs'),
    _ = require('underscore'),
    Format = require('./format').Format;

var Spreadsheet = function(filename) {
    this.filename = filename;
    this.format = path.extname(this.filename).substr(1);
    return this;
};

Spreadsheet.prototype.exists = function(callback) {
    var spreadsheet = this;
    this.stats(function(err, stats) {
        callback(err, stats && stats.filename === path.basename(spreadsheet.filename));
    });
};

Spreadsheet.prototype.stats = function(callback) {
    var spreadsheet = this;
    var stats = {
        filename: path.basename(spreadsheet.filename),
        format: spreadsheet.format
    };

    fs.stat(this.filename, function(err, data) {
        if (err) return callback(err);
        stats.size = data.size;
        stats.updated = data.mtime;

        spreadsheet.data(function(err, data) {
            if (err) return callback(err);
            stats.records = _.size(data);

            callback(null, stats);
        });
    });
};

Spreadsheet.prototype.data = function(options, callback) {
    var spreadsheet = this;
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    var format = new Format(this);
    format.data(function(err, data) {
        if (err) return callback(err);

        spreadsheet.filter(data, options, function(err, data) {
            callback(err, data);
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
                var query = {},
                    idAttr = _.keys(data[0])[0];

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
                if (options.reverse === 'true') {
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

Spreadsheet.prototype.addRows = function(rows, callback) {
    if (!_.isArray(rows)) rows = [rows];

    var format = new Format(this);
    format.addRows(rows, function(err, status) {
        if (err) return callback(err);
        callback(null, status);
    });
};

module.exports = function(filename) {
  return new Spreadsheet(filename);
};

module.exports.Spreadsheet = Spreadsheet;
