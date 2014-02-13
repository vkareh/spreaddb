var fs = require('fs'),
    path = require('path');

var Format = function(options) {
    if (typeof options === 'string') {
        this.filename = options;
        this.format = path.extname(options).substr(1);
    } else {
        this.filename = options.filename;
        this.format = path.extname(options.filename).substr(1);
    }
    return this;
};

Format.prototype.formats = {
    csv: require('./formats/csv'),
    xls: require('./formats/xlsx'),
    xlsx: require('./formats/xlsx')
};

Format.prototype.supported = function() {
    return this.formats.hasOwnProperty(this.format);
};

Format.prototype.create = function(callback) {
    this.formats[this.format].create(this.filename, function(err, status) {
        if (err) callback(err);
        else callback(null, status);
    });
};

Format.prototype.read = function(filename, callback) {
    if (typeof filename === 'function') {
        callback = filename;
        filename = this.filename;
    }

    if (!filename) return callback(new Error('No filename specified'));
    if (!this.supported()) return callback(new Error('Unsupported file format'));

    this.formats[this.format].read(filename, function(err, data) {
        if (err) return callback(err);
        callback(null, data);
    });
};

Format.prototype.add = function(rows, callback) {
    if (!this.filename) return callback(new Error('No filename specified'));
    if (!this.supported()) return callback(new Error('Unsupported file format'));

    this.formats[this.format].add(this.filename, rows, function(err, status) {
        if (err) callback(err);
        else callback(null, status);
    });
};

module.exports = function(spreadsheet) {
    var format = new Format(spreadsheet);
};

module.exports.Format = Format;
