var expect = require("chai").expect,
    fs = require('fs'),
    path = require('path'),
    Spreadsheet = require("../lib/spreadsheet.js").Spreadsheet;

var filename = path.join(__dirname, 'spreadsheet.csv');

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
                fs.exists(filename, function(exists) {
                    expect(exists).to.be.true;
                    done();
                });
            });
        });
    });

    describe('#exists()', function() {
        it('should detemine that the file exists', function(done) {
            var spreadsheet = new Spreadsheet(filename);
            spreadsheet.exists(function(err, exists) {
                expect(err).to.be.null;
                expect(exists).to.be.true;
                done();
            });
        });
        it('should detemine that the file does not exists', function(done) {
            var spreadsheet = new Spreadsheet('false.csv');
            spreadsheet.exists(function(err, exists) {
                expect(err).to.be.null;
                expect(exists).to.be.false;
                done();
            });
        });
    });

    describe('#has()', function() {
        it('should determine that a row exists', function(done) {
            var spreadsheet = new Spreadsheet(filename);
            spreadsheet.has('Alice', function(err, has) {
                expect(err).to.be.null;
                expect(has).to.be.true;
                done();
            });
        });
        it('should determine that a row does not exists', function(done) {
            var spreadsheet = new Spreadsheet(filename);
            spreadsheet.has('Adam', function(err, has) {
                expect(err).to.be.null;
                expect(has).to.be.false;
                done();
            });
        });
    });

    describe('#stats()', function() {
        it('should return file stats', function(done) {
            var spreadsheet = new Spreadsheet(filename);
            spreadsheet.stats(function(err, stats) {
                expect(err).to.be.null;
                expect(stats).to.have.property('filename');
                expect(stats.records).to.equal(3);
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

    describe('#remove()', function() {
        it('should remove a row', function(done) {
            var spreadsheet = new Spreadsheet(filename);
            spreadsheet.remove('Alice', function(err, status) {
                expect(err).to.be.null;
                expect(status).to.have.property('ok');
                spreadsheet.has('Alice', function(err, has) {
                    expect(err).to.be.null;
                    expect(has).to.be.false;
                    done();
                });
            });
        });
    });

    describe('#add()', function() {
        it('should add a row', function(done) {
            var spreadsheet = new Spreadsheet(filename);
            var rows = [{name: 'Dave', email: 'dave@example.com', phone: '555-4567'}];
            spreadsheet.add(rows, function(err, status) {
                expect(err).to.be.null;
                expect(status).to.have.property('ok');
                spreadsheet.has('Dave', function(err, has) {
                    expect(err).to.be.null;
                    expect(has).to.be.true;
                    done();
                });
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
