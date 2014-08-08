angular.module('todoCtrl', [])
  .controller('todoController', function($scope, $http, Todos) {
    console.log("todo controller");

    var init_todo = function() {
      $scope.formData = {};
      $scope.err_msg = '';
    }

    init_todo();

    Todos.get()
      .success(function(data) {
        $scope.todos = data;
      });

    $scope.createTodo = function() {
      if (!$.isEmptyObject($scope.formData)) {
        Todos.create($scope.formData)
          .success(function(data) {
            init_todo();
            $scope.todos = data;
          })
          .error(function(err, status) {
            if (!$.isEmptyObject(err))
              $scope.err_msg = err.message;
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
