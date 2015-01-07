'use strict';

angular.module('assassinsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.admin', {
        url: '/admin',
        templateUrl: 'app/dashboard.admin/dashboard.admin.html',
        controller: 'DashboardAdminCtrl'
      });
  });