var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    Spreadsheet = require('./spreadsheet').Spreadsheet;

var spreaddb = global.spreaddb;
var app = express();

app.get('/', function(req, res) {
    res.send(JSON.stringify({
        spreaddb: 'Power to the legacy',
        version: require('../package.json').version
    }));
});

app.get('/_all', function(req, res) {
    if (req.query && req.query.stats === 'true') {
        res.send(JSON.stringify(spreaddb.files));
    } else {
        var files = spreaddb.files.map(function(file) {
            return path.basename(file.filename);
        });
        res.send(JSON.stringify(files));
    }
});

app.get('/:filename', function(req, res) {
    var spreadsheet = new Spreadsheet(path.join(spreaddb.directory, req.params.filename));
    spreadsheet.data(req.query, function(err, data) {
        if (err) res.send(err);
        else res.send(JSON.stringify(data));
    });
});

app.get('/:filename/:row', function(req, res) {
    var spreadsheet = new Spreadsheet(path.join(spreaddb.directory, req.params.filename));
    spreadsheet.data({_id: req.params.row, limit: 1}, function(err, data) {
        if (err) res.send(err);
        else res.send(JSON.stringify(data[0]));
    });
});

module.exports = app;
