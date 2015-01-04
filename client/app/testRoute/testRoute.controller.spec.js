'use strict';

describe('Controller: TestRouteCtrl', function () {

  // load the controller's module
  beforeEach(module('assassinsApp'));

  var TestRouteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestRouteCtrl = $controller('TestRouteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
