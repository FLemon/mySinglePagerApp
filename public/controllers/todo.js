angular.module('todoCtrl', [])
  .controller('todoController', function($scope, $http, Todos) {
    console.log("todo controller");

    var init_page = function() {
      $scope.formData = {};
      $scope.err_msg = '';
    }

    init_page();

    Todos.get()
      .success(function(data) {
        $scope.todos = data;
      });

    $scope.createTodo = function() {
      if (!$.isEmptyObject($scope.formData)) {
        Todos.create($scope.formData)
          .success(function(data) {
            init_page();
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
