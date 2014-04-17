var expect = require('chai').expect;
var request = require('supertest');
var fs = require('fs');
var server = require('../lib/server.js');

describe('Server', function() {
  before(function(done) {
    require('../lib/init').indexFiles(function() {
      done();
    });
  });

  describe('GET /', function() {
    it('should return MOTD and version', function(done) {
      request(server)
        .get('/')
        .expect(200, {
          spreaddb: 'Power to the legacy',
          version: require('../package.json').version
        }, done);
    });
  });

  describe('GET /_all', function() {
    it('should return a list of all spreadsheets tracked by this server', function(done) {
      request(server)
        .get('/_all')
        .expect(200, [], done);
    });
  });

  describe('PUT /:filename', function() {
    it('should create an empty spreadsheet', function(done) {
      request(server)
        .put('/server.test1.csv')
        .expect(200, done);
    });
    it('should create a non-empty spreadsheet', function(done) {
      var data = [{name: 'University of Michigan', city: 'Ann Arbor', state: 'Michigan'}];
      request(server)
        .put('/server.test2.csv')
        .send(data)
        .expect(200, done);
    });
  });

  describe('POST /:filename', function() {
    it('should insert a new row with an automatically generated id', function(done) {
      request(server)
        .post('/server.test2.csv')
        .send({name: 'Harvard', city: 'Cambridge', state: 'Massachusetts'})
        .expect(200, done);
    });
  });

  describe('GET /:filename', function() {
    it('should read a spreadsheet metadata', function(done) {
      request(server)
        .get('/server.test2.csv')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body).to.contain.keys(['filename', 'format', 'records']);
          expect(res.body.filename).to.equal('server.test2.csv');
          expect(res.body.format).to.equal('csv');
          expect(res.body.records).to.equal(2);
          done();
        });
    });
  });

  describe('GET /:filename/_rows', function() {
    it('should return all rows on a spreadsheet', function(done) {
      request(server)
        .get('/server.test2.csv/_rows')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an.instanceof(Array);
          expect(res.body).to.have.length(2);
          done();
        });
    });
    it('should return filtered rows from a spreadsheet', function(done) {
      request(server)
        .get('/server.test2.csv/_rows?state=Michigan')
        .expect(200, [{
          name: 'University of Michigan',
          city: 'Ann Arbor',
          state: 'Michigan'
        }], done);
    });
  });

  describe('DELETE /:filename', function() {
    it('should delete a spreadsheet', function(done) {
      request(server)
        .del('/server.test1.csv')
        .expect(200, done);
    });
  });

  after(function() {
    fs.unlinkSync('./test/server.test2.csv');
  });
});
