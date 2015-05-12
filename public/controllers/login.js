angular.module('loginCtrl', [])
.controller('loginController', function($scope, $window, $interval, $http, $cookieStore) {
  console.log("login controller");
  $scope.token = $cookieStore.get('access_token')

  var getUser = function(token, callback) {
    if ($scope.token)
      $http.get('/user', { headers: { 'Authorization': 'Bearer '+$scope.token } }).success(function(data) {
        $scope.user = data.user
        if (callback)
          callback()
      })
  }

  getUser($scope.token)

  $scope.googleAuth = function() {
    var left = screen.width/2 - 200,
        top = screen.height/2 - 250,
        interval = 1000,
        popup = $window.open('/auth/google', 'auth window', "top=" + top + ",left=" + left + ",width=400,height=500");

    $window.$scope = $scope

    var i = $interval(function() {
      if ($scope.token)
        getUser($scope.token, function() {
          $cookieStore.put('access_token', $scope.token)
          $interval.cancel(i)
        })
    },
    interval);
  };
});
