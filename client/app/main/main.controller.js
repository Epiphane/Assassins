'use strict';

angular.module('assassinsApp')
  .controller('MainCtrl', function($scope, $http, socket) {
    $scope.awesomeThings = [];

    $scope.addThing = function() {
      if ($scope.newThing === '') {
        return;
      }
      $scope.newThing = '';
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  });
