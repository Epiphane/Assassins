'use strict';

angular.module('assassinsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('testRoute', {
        url: '/testRoute',
        templateUrl: 'app/testRoute/testRoute.html',
        controller: 'TestRouteCtrl'
      });
  });