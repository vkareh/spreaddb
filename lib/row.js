var _ = require('underscore'),
    Spreadsheet = require('./spreadsheet').Spreadsheet;

var Row = function(options) {
    if (!options) options = {};
    if (options.spreadsheet instanceof Spreadsheet) {
        this.spreadsheet = options.spreadsheet;
    } else {
        this.spreadsheet = new Spreadsheet(options.spreadsheet);
    }
    this._id = options.id;
    this.data = options.data || {};
    return this;
};

Row.prototype.create = function(callback) {
    this.spreadsheet.add(this.data, function(err, status) {
        if (err) callback(err);
        else callback(null, status);
    });
};

Row.prototype.fetch = function(callback) {
    this.spreadsheet.read(this._id, function(err, data) {
        if (err) callback(err);
        else callback(null, data);
    });
};

Row.prototype.update = function(callback) {
    var row = this;
    row.destroy(function(err, status) {
        if (err) return callback(err);
        row.create(function(err, status) {
            if (err) callback(err);
            else callback(null, status);
        });
    });
};

Row.prototype.destroy = function(callback) {
    this.spreadsheet.remove(row._id, function(err, status) {
        if (err) callback(err);
        else callback(null, status);
    });
};
