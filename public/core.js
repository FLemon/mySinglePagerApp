angular.module('jinTodo', ['ngRoute', 'twitCtrl', 'twitService', 'twitDirective',
  'todoCtrl', 'todoService', 'todoDirective', 'confirmDirective',
  'gitCtrl', 'gitService', 'gitDirective']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      controller: function() {},
      templateUrl: '/templates/home.html'
    })
    .otherwise({redirectTo: '/'});
  }]);
