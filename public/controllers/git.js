angular.module('gitCtrl', [])
  .controller('gitController', function($scope, $http, Git) {
    console.log("git controller");

    Git.user()
      .success(function(data) {
        $scope.user = data
      })
  })
