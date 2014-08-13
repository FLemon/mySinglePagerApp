angular.module('jinTodo', ['ngRoute', 'twitCtrl', 'twitService', 'todoCtrl', 'todoService']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      controller: function() {},
      templateUrl: '/templates/home.html'
    })
    .otherwise({redirectTo: '/'});
  }]);
