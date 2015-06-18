angular.module('jinTodo', ['ngRoute', 'ngCookies',
  'twitCtrl', 'twitService', 'twitDirective',
  'todoCtrl', 'todoService', 'todoDirective', 'confirmDirective',
  'gitCtrl', 'gitService', 'gitDirective',
  'loginCtrl', 'loginDirective',
  'userService']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      controller: function() {},
      templateUrl: '/templates/home.html'
    })
    .otherwise({redirectTo: '/'});
  }]);
