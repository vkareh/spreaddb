var expect = require("chai").expect;
var Format = require("../lib/format.js");

var filename = 'format.csv';
var format;

describe('Format', function() {
  before(function() {
    format = new Format({filename: filename});
  });

  describe('#__constructor', function() {
    it('should instantiate a Format object', function() {
      expect(format).to.have.keys(['filename', 'format']);
      expect(format.filename).to.contain(filename);
      expect(format.format).to.equal('csv');
    });
  });

  describe('#supported()', function() {
    it('should determine that the file format is supported', function() {
      format.supported(function(err, supported) {
        expect(err).to.be.null;
        expect(supported).to.be.true;
      });
    });

    it('should determine that the file format is not supported', function() {
      var unsupported = new Format({filename: 'unsupported.jpg'});
      unsupported.supported(function(err, supported) {
        expect(err).to.be.null;
        expect(supported).to.be.false;
      });
    });
  });

  describe('#create()', function() {
    it('should create a file with the specified format', function(done) {
      format.create(function(err, status) {
        expect(err).to.be.null;
        expect(status).to.have.property('ok');
        done();
      });
    });
  });

  describe('#add()', function() {
    it('should add a row', function(done) {
      var data = [{name: 'Alice', email: 'alice@example.com', phone: '555-1234'}];
      format.add(data, function(err, status) {
        expect(err).to.be.null;
        expect(status).to.have.property('ok');
        done();
      });
    });
  });

  describe('#read()', function() {
    it('should read all data from a file', function(done) {
      format.read(function(err, data) {
        expect(err).to.be.null;
        expect(data).to.have.length(1);
        expect(data[0]).to.have.keys(['name', 'email', 'phone']);
        expect(data[0].name).to.equal('Alice');
        expect(data[0].email).to.equal('alice@example.com');
        expect(data[0].phone).to.equal('555-1234');
        done();
      });
    });
  });

  describe('#remove()', function() {
    it('should remove a row from the file', function(done) {
      format.remove('Alice', function(err, status) {
        expect(err).to.be.null;
        expect(status).to.have.property('ok');
        format.read(function(err, data) {
          expect(err).to.be.null;
          expect(data).to.have.length(1);
          expect(data[0]).to.be.instanceOf(Array);
          done();
        });
      });
    });
  });

  after(function() {
    require('fs').unlink(require('path').join(__dirname, filename));
  });
});
