angular.module('todoCtrl', [])
  .controller('todoController', function($scope, $http, Todos) {
    console.log("todo controller");
    $scope.formData = {};

    Todos.get()
      .success(function(data) {
        $scope.todos = data;
      });

    $scope.createTodo = function() {
      if (!$.isEmptyObject($scope.formData)) {
        Todos.create($scope.formData)
          .success(function(data) {
            $scope.formData = {};
            $scope.todos = data;
          })
      }
    };

    $scope.deleteTodo = function(id) {
      Todos.delete(id)
        .success(function(data) {
          $scope.todos = data;
        })
    };
  });
