var expect = require("chai").expect;
var Spreadsheet = require("../lib/spreadsheet.js");
var Row = require("../lib/row.js");

var filename = 'rows.csv';
var spreadsheet;

describe('Row', function() {
  before(function() {
    spreadsheet = new Spreadsheet({filename: filename});
  });

  describe('#__constructor', function() {
    it('should instantiate a Row object', function() {
      var row = new Row({spreadsheet: spreadsheet});
      expect(row).to.have.property('spreadsheet');
      expect(row.spreadsheet).to.be.an.instanceOf(Spreadsheet);
      expect(row).to.have.property('data');
      expect(row.data).to.be.empty;
    });
  });

  describe('#create()', function() {
    it('should add a row to a spreadsheet', function(done) {
      var data = {name: 'Alice', email: 'alice@example.com', phone: '555-1234'};
      var row = new Row({spreadsheet: spreadsheet, data: data});
      row.create(function(err, status) {
        expect(err).to.be.null;
        expect(status).to.have.property('ok');
        spreadsheet.has('Alice', function(err, has) {
          expect(err).to.be.null;
          expect(has).to.be.true;
          done();
        });
      });
    });
  });

  describe('#fetch()', function() {
    it('should return a row', function(done) {
      var row = new Row({spreadsheet: spreadsheet, _id: 'Alice'});
      row.fetch(function(err, data) {
        expect(err).to.be.null;
        expect(data).to.have.keys(['name', 'email', 'phone']);
        expect(data.name).to.equal('Alice');
        expect(data.email).to.equal('alice@example.com');
        expect(data.phone).to.equal('555-1234');
        done();
      });
    });
  });

  describe('#update()', function() {
    it('should update a row', function(done) {
      var data = {name: 'Alice', email: 'alicia@example.com', phone: '555-1234'};
      var row = new Row({spreadsheet: spreadsheet, _id: 'Alice', data: data});
      row.update(function(err, status) {
        expect(err).to.be.null;
        expect(status).to.have.property('ok');
        row.fetch(function(err, data) {
          expect(err).to.be.null;
          expect(data).to.contain.key('email');
          expect(data.email).to.equal('alicia@example.com');
          done();
        });
      });
    });
  });

  describe('#destroy()', function() {
    it('should remove a row', function(done) {
      var row = new Row({spreadsheet: spreadsheet, _id: 'Alice'});
      row.destroy(function(err, status) {
        expect(err).to.be.null
        expect(status).to.have.property('ok');
        row.fetch(function(err, data) {
          expect(err).to.be.null;
          expect(data).to.be.undefined;
          done();
        });
      });
    });
  });

  after(function() {
    require('fs').unlink(require('path').join(__dirname, filename));
  });
});
