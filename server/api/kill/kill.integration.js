'use strict';

var app = require('../../app');
var request = require('supertest');

describe('Kill API:', function() {

  describe('GET /api/kills', function() {
    var kills;

    beforeEach(function(done) {
      request(app)
        .get('/api/kills')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          kills = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      kills.should.be.instanceOf(Array);
    });

  });

});
