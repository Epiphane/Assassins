'use strict';

angular.module('assassinsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.client', {
        url: '/',
        templateUrl: 'app/dashboard.client/dashboard.client.html',
        controller: 'DashboardClientCtrl'
      });
  });