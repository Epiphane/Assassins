'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var killCtrlStub = {
  index: 'killCtrl.index'
};

var routerStub = {
  get: sinon.spy(),
  post: sinon.spy()
};

// require the index with our stubbed out modules
var killIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './kill.controller': killCtrlStub
});

describe('Kill API Router:', function() {

  it('should return an express router instance', function() {
    killIndex.should.equal(routerStub);
  });

  describe('GET /api/kills', function() {

    it('should route to kill.controller.index', function() {
      routerStub.get
                .withArgs('/', 'killCtrl.index')
                .should.have.been.calledOnce;
    });

  });

});
