angular.module('loginCtrl', [])
.controller('loginController', function($scope, $window, $interval, $http, $cookieStore, User) {
  console.log("login controller");

  $scope.user = User
  $scope.user.update()

  $scope.googleAuth = function() {
    var left = screen.width/2 - 200,
        top = screen.height/2 - 250,
        interval = 1000,
        popup = $window.open('/auth/google', 'auth window', "top=" + top + ",left=" + left + ",width=400,height=500");

    $window.$scope = $scope

    var i = $interval(function() {
      if ($scope.token) {
        $cookieStore.put('access_token', $scope.token)
        $scope.token = ''
        console.log("got it:" + $cookieStore.get('access_token'))
        User.update()
        $interval.cancel(i)
      }

    },
    interval);
  };
});
