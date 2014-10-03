angular.module('jinTodo', ['ngRoute', 'twitCtrl', 'twitService', 'twitDirective',
  'todoCtrl', 'todoService', 'todoDirective', 'confirmDirective']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      controller: function() {},
      templateUrl: '/templates/home.html'
    })
    .otherwise({redirectTo: '/'});
  }]);
