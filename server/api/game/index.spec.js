'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var gameCtrlStub = {
  index: 'gameCtrl.index'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
  use: sinon.spy()
};

// require the index with our stubbed out modules
var gameIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './game.controller': gameCtrlStub
});

describe('Game API Router:', function() {

  it('should return an express router instance', function() {
    gameIndex.should.equal(routerStub);
  });

  describe('GET /api/games', function() {

    it('should route to game.controller.index', function() {
      routerStub.get
                .withArgs('/', 'gameCtrl.index')
                .should.have.been.calledOnce;
    });

  });

});
