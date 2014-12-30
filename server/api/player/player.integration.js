'use strict';

var app = require('../../app');
var request = require('supertest');

describe('Player API:', function() {

  describe('GET /api/players', function() {
    var players;

    beforeEach(function(done) {
      request(app)
        .get('/api/players')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          players = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      players.should.be.instanceOf(Array);
    });

  });

});
