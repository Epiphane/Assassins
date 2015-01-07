'use strict';

angular.module('assassinsApp')
  .controller('DashboardAdminCtrl', function ($state, $scope, $stateParams, $http) {
    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase === '$apply' || phase === '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    $scope.friends = [1, 2];

    $scope.getPlayers = function() {
      $http({
        method: 'GET',
        url: '/api/games/' + $stateParams.id + '/players'
      }).then(function(response) {
        $scope.players = response.data;
        $scope.safeApply();
      }, function(error) {
        if(error.status === 404) {
          $state.go('main');
        }
        else {
          console.log(error);
        }
      });
    };
    $scope.getPlayers();

    $scope.fetchPlayers = function() {
      console.log('hi!');
      $http({
        method: 'PUT',
        url: '/api/games/' + $stateParams.id + '/fetch'
      }).then(function(response) {
        $scope.players = response.data;
        $scope.safeApply();
      }, function(error) {
        if(error.status === 404) {
          $state.go('main');
        }
        else {
          console.log(error);
        }
      });
    };
  });
