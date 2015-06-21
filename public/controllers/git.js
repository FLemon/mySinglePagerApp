angular.module('gitCtrl', [])
.controller('gitController', function($scope, $http, Git) {
    console.log("git controller");

    $scope.git = Git
  })
