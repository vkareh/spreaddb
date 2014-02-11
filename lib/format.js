var Format = function(options) {
    if (typeof options === 'string') {
        this.format = options;
    } else {
        this.format = options.format;
        this.filename = options.filename;
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

Format.prototype.data = function(filename, callback) {
    if (typeof filename === 'function') {
        callback = filename;
        filename = this.filename;
    }

    if (!filename) return callback(new Error('No filename specified'));
    if (!this.supported()) return callback(new Error('Unsupported file format'));

    this.formats[this.format].data(filename, function(err, data) {
        if (err) return callback(err);
        callback(null, data);
    });
};

Format.prototype.addRows = function(rows, callback) {
    if (!this.filename) return callback(new Error('No filename specified'));
    if (!this.supported()) return callback(new Error('Unsupported file format'));

    this.formats[this.format].addRows(this.filename, rows, function(err, status) {
        if (err) callback(err);
        else callback(null, status);
    });
};

module.exports = function(spreadsheet) {
    var format = new Format(spreadsheet);
};

module.exports.Format = Format;
