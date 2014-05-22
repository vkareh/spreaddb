var fs = require('fs');
var path = require('path');
var express = require('express');
var _ = require('underscore');
var Spreadsheet = require('./spreadsheet');
var Row = require('./row');
var config = require('./config');

var app = express();
app.use(express.urlencoded());
app.use(express.json());

// Global methods
// --------------

// Returns MOTD and version
app.get('/', function(req, res) {
  res.send(200, {
    spreaddb: 'Power to the legacy',
    version: require('../package.json').version
  });
});

// Returns a list of all spreadsheets tracked by this server
app.get('/_all', function(req, res) {
  if (req.query && req.query.stats === 'true') {
    res.send(200, config.files);
  } else {
    var files = config.files.map(function(file) {
      return path.basename(file.filename);
    });
    res.send(200, files);
  }
});

// Spreadsheet methods
// -------------------

// Returns spreadsheet information
app.get('/:filename', function(req, res) {
  var spreadsheet = new Spreadsheet({filename: req.params.filename});
  spreadsheet.stats(function(err, data) {
    if (err) res.send(500, err);
    else res.send(200, data);
  });
});

// Create a new spreadsheet
app.put('/:filename', function(req, res) {
  var spreadsheet = new Spreadsheet({filename: req.params.filename, rows: req.body});
  spreadsheet.create(function(err, status) {
    if (err) res.send(500, err);
    else res.send(200, status);
  });
});

// Delete an existing spreadsheet
app.delete('/:filename', function(req, res) {
  var spreadsheet = new Spreadsheet({filename: req.params.filename});
  spreadsheet.destroy(function(err, status) {
    if (err) res.send(500, err);
    else res.send(200, status);
  });
});

// Returns rows from this spreadsheet
app.get('/:filename/_rows', function(req, res) {
  var spreadsheet = new Spreadsheet({filename: req.params.filename});
  spreadsheet.read(req.query, function(err, data) {
    if (err) res.send(500, err);
    else res.send(200, data);
  });
});

// Spreadsheet row methods
// -----------------------

// Inserts a new row with an automatically generated id
app.post('/:filename', function(req, res) {
  var row = new Row({spreadsheet: req.params.filename, data: req.body});
  row.create(function(err, status) {
    if (err) res.send(500, err);
    else res.send(200, status);
  });
});

// Returns a spreadsheet row
app.get('/:filename/:rowId', function(req, res) {
  var row = new Row({spreadsheet: req.params.filename, _id: req.params.rowId});
  row.fetch(function(err, data) {
    if (err) res.send(500, err);
    else res.send(200, data);
  });
});

// Updates an existing row
app.put('/:filename/:rowId', function(req, res) {
  var row = new Row({spreadsheet: req.params.filename, _id: req.params.rowId, data: req.body});
  row.update(function(err, status) {
    if (err) res.send(500, err);
    else res.send(200, status);
  });
});

// Deletes a row
app.delete('/:filename/:rowId', function(req, res) {
  var row = new Row({spreadsheet: req.params.filename, _id: req.params.rowId});
  row.destroy(function(err, status) {
    if (err) res.send(500, err);
    else res.send(200, status);
  });
});

module.exports = app;
