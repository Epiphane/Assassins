'use strict';

angular.module('assassinsApp')
  .controller('NavbarCtrl', function ($scope, $http, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'state': 'main'
    }];

    $scope.games = [];
    $scope.getGames = function() {
      Auth.isLoggedIn(function(loggedIn) {
        if(loggedIn) {
          $http({
            method: 'GET',
            url: '/api/users/' + Auth.getCurrentUser()._id + '/games'
          }).then(function(response) {
            $scope.games = response.data;
          });
        }
      });
    };
    $scope.getGames();

    $scope.$watch(function() {
      return Auth.getCurrentUser(); 
    }, $scope.getGames);

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
  });
