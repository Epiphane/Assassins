'use strict';

angular.module('assassinsApp')
  .controller('DashboardCtrl', function ($scope, $stateParams, $state, $http) {
    $scope.message = 'Hello';

    $http({
      method: 'GET',
      url: '/api/games/' + $stateParams.id
    }).then(function(response) {
      $scope.game = response.data;
    }, function(error) {
      if(error.status === 404)
        $state.go('main');
      else
        console.log(error)
    });

    $scope.getPlayer = function() {
      $http({
        method: 'GET',
        url: '/api/games/' + $stateParams.id + '/players/me'
      }).then(function(response) {
        if(response.data) {
          $scope.player = response.data.player;
          $scope.targets = response.data.targets;
        }
      }, function(error) {
        console.log(error)
      });
    };
    $scope.getPlayer();

    $scope.joinGame = function() {
      $http({
        method: 'POST',
        url: '/api/games/' + $stateParams.id + '/players'
      }).then(function(response) {
        console.log(response);

        $scope.getPlayer();
      }, function(error) {
        console.log(error)
      });
    };

    $scope.targets = function() {
      if($scope.player && $scope.player.rank === null) {
        return false;
      }
      if($scope.game && $scope.player && $scope.game.round) {
        return $scope.game.round[$scope.player.rank];
      }
    };

    $scope.date = function(gameDate) {
      return new Date(gameDate);
    };
  });

angular.module('assassinsApp')
  .filter('newlines', function() {
    return function(text) {
      if(text)
        return text.replace(/\n/g, '<br />');
      else
        return '';
    };
  });
