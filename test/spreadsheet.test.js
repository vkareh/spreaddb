var expect = require("chai").expect,
    path = require('path'),
    Spreadsheet = require("../lib/spreadsheet.js").Spreadsheet;

var filename = path.join(__dirname, 'test.csv');

describe('Spreadsheet', function() {
    describe('#__constructor', function() {
        it('should instantiate a Spreadsheet object', function() {
            var spreadsheet = new Spreadsheet(filename);
            expect(spreadsheet.filename).to.equal(filename);
            expect(spreadsheet.format).to.have.property('format');
        });
    });

    describe('#create()', function() {
        it('should create a file', function(done) {
            var data = [
                {name: 'Alice', email: 'alice@example.com', phone: '555-1234'},
                {name: 'Bob', email: 'bob@example.com', phone: '555-2345'},
                {name: 'Carol', email: 'carol@example.com', phone: '555-3456'}
            ];
            var spreadsheet = new Spreadsheet(filename);
            spreadsheet.create(data, function(err, status) {
                expect(err).to.be.null;
                expect(status).to.have.property('ok');
                done();
            });
        });
    });

    describe('#read()', function() {
        it('should return file contents', function(done) {
            var spreadsheet = new Spreadsheet(filename);
            spreadsheet.read(function(err, data) {
                expect(err).to.be.null;
                expect(data).to.have.length(3);
                expect(data[0]).to.have.keys(['name', 'email', 'phone']);
                expect(data[0].name).to.equal('Alice');
                expect(data[0].email).to.equal('alice@example.com');
                expect(data[0].phone).to.equal('555-1234');
                done();
            });
        });
    });

    describe('#destroy()', function() {
        it('should delete a file', function() {
            var spreadsheet = new Spreadsheet(filename);
            spreadsheet.destroy(function(err, status) {
                expect(err).to.be.null;
                expect(status).to.have.property('ok');
            });
        });
    });
});
