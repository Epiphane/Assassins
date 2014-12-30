'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var playerCtrlStub = {
  index: 'playerCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var playerIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './player.controller': playerCtrlStub
});

describe('Player API Router:', function() {

  it('should return an express router instance', function() {
    playerIndex.should.equal(routerStub);
  });

  describe('GET /api/players', function() {

    it('should route to player.controller.index', function() {
      routerStub.get
                .withArgs('/', 'playerCtrl.index')
                .should.have.been.calledOnce;
    });

  });

});
