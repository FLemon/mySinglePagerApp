angular.module('todoDirective', [])
  .directive('myTodos', function() {
    return {
      templateUrl: '/templates/my-todos.html'
    };
  });
