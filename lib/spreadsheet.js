var path = require( 'path'),
    fs = require('fs'),
    _ = require('underscore'),
    Format = require('./format').Format;

var Spreadsheet = function(options) {
    if (!options) options = {};
    if (typeof options === 'string') {
        this.filename = options;
    } else {
        this.filename = options.filename;
    }
    this.format = new Format(this);
    return this;
};

Spreadsheet.prototype.exists = function(callback) {
    var spreadsheet = this;
    this.stats(function(err, stats) {
        callback(null, !!stats || err.code !== 'ENOENT');
    });
};

Spreadsheet.prototype.has = function(id, callback) {
    var spreadsheet = this;
    this.read(id, function(err, data) {
        callback(err, !!data);
    });
};

Spreadsheet.prototype.stats = function(callback) {
    var spreadsheet = this;
    var stats = {
        filename: path.basename(spreadsheet.filename),
        format: spreadsheet.format.format
    };

    fs.stat(this.filename, function(err, data) {
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
        rows = [];
    }

    var spreadsheet = this,
        format = this.format;

    spreadsheet.exists(function(err, exists) {
        if (err) return callback(err);
        if (exists) return callback(new Error('Spreadsheet already exists'));

        format.create(function(err, status) {
            if (err) return callback(err);

            spreadsheet.add(rows, function(err, status) {
                if (err) callback(err);
                else callback(null, status);
            });
        });
    });
};

Spreadsheet.prototype.destroy = function(callback) {
    var spreadsheet = this;
    fs.unlink(spreadsheet.filename, function(err) {
        if (err) callback(err);
        else callback(null, 'Successfully deleted ' + path.basename(spreadsheet.filename));
    });
};

Spreadsheet.prototype.read = function(query, callback) {
    if (typeof query === 'function') {
        callback = query;
        query = {};
    } else if (typeof query === 'string') {
        query = {_id: query};
    }

    var spreadsheet = this,
        format = this.format;

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

module.exports = function(filename) {
  return new Spreadsheet(filename);
};

module.exports.Spreadsheet = Spreadsheet;
