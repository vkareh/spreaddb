var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    Spreadsheet = require('./spreadsheet').Spreadsheet,
    Row = require('./row').Row;

var spreaddb = global.spreaddb;
var app = express();

// Global methods
// --------------

// Returns MOTD and version
app.get('/', function(req, res) {
    res.send(JSON.stringify({
        spreaddb: 'Power to the legacy',
        version: require('../package.json').version
    }));
});

// Returns a list of all spreadsheets tracked by this server
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

// Spreadsheet methods
// -------------------

// Returns spreadsheet information
app.get('/:filename', function(req, res) {
    var spreadsheet = new Spreadsheet(path.join(spreaddb.directory, req.params.filename));
    spreadsheet.stats(function(err, data) {
        if (err) res.send(err);
        else res.send(JSON.stringify(data));
    });
});

// Create a new spreadsheet
app.put('/:filename', function(req, res) {
    var spreadsheet = new Spreadsheet(path.join(spreaddb.directory, req.params.filename));
    spreadsheet.create(function(err, status) {
        if (err) res.send(err);
        else res.send(JSON.stringify(status));
    });
});

// Delete an existing spreadsheet
app.delete('/:filename', function(req, res) {
    var spreadsheet = new Spreadsheet(path.join(spreaddb.directory, req.params.filename));
    spreadsheet.destroy(function(err, status) {
        if (err) res.send(err);
        else res.send(JSON.stringify(status));
    });
});

// Returns all rows in this spreadsheet
app.get('/:filename/_all', function(req, res) {
    var spreadsheet = new Spreadsheet(path.join(spreaddb.directory, req.params.filename));
    spreadsheet.read(function(err, data) {
        if (err) res.send(err);
        else res.send(JSON.stringify(data));
    });
});

// Returns certain rows from this spreadsheet
app.post('/:filename/_all', function(req, res) {
    var spreadsheet = new Spreadsheet(path.join(spreaddb.directory, req.params.filename)),
        query = '';

    req.on('data', function(chunk) {
        query += chunk;
    });

    req.on('end', function(err) {
        if (err) res.send(new Error('There was an error parsing your query'));
        else {
            try {
                query = JSON.parse(query);
            } catch(e) {
                res.send(e);
            }
            spreadsheet.read(query || {}, function(err, data) {
                if (err) res.send(err);
                else res.send(data);
            });
        }
    });
});

// Spreadsheet row methods
// -----------------------

// Inserts a new row with an automatically generated id
app.post('/:filename', function(req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });

    req.on('end', function(err) {
        if (err) res.send(new Error('There was an error parsing your data'));
        else {
            try {
                data = JSON.parse(data);
            } catch(e) {
                res.send(e);
            }

            var row = new Row({spreadsheet: path.join(spreaddb.directory, req.params.filename), data: data});
            row.create(function(err, status) {
                if (err) res.send(err);
                else res.send(status);
            });
        }
    });
});

// Returns a spreadsheet row
app.get('/:filename/:rowId', function(req, res) {
    var row = new Row({spreadsheet: path.join(spreaddb.directory, req.params.filename), _id: req.params.rowId});
    row.fetch(function(err, data) {
        if (err) res.send(err);
        else res.send(data);
    });
});

// Updates an existing row
app.put('/:filename/:rowId', function(req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });

    req.on('end', function(err) {
        if (err) res.send(new Error('There was an error parsing your data'));
        else {
            try {
                data = JSON.parse(data);
            } catch(e) {
                res.send(e);
            }

            var row = new Row({spreadsheet: path.join(spreaddb.directory, req.params.filename), _id: req.params.rowId, data: data});
            row.update(function(err, status) {
                if (err) res.send(err);
                else res.send(status);
            });
        }
    });
});

// Deletes a row
app.delete('/:filename/:rowId', function(req, res) {
    var row = new Row({spreadsheet: path.join(spreaddb.directory, req.params.filename), _id: req.params.rowId});
    row.destroy(function(err, status) {
        if (err) res.send(err);
        else res.send(status);
    });
});

module.exports = app;
