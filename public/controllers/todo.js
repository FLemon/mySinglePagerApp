angular.module('todoCtrl', [])
  .controller('todoController', function($scope, $http, Todos) {
    console.log("todo controller");

    var init_todo = function() {
      $scope.modalShown = false;
      $scope.formData = {};
      $scope.err_msg = '';
    }

    init_todo();

    Todos.get()
      .success(function(data) {
        $scope.todos = data;
      });

    $scope.showConfirmRemove = function () {
        $scope.removeWanted = true;
    };

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

    $scope.deleteClicked = function(todo) {
      $scope.selectedTodo = todo;
      $scope.modalShown = !$scope.modalShown;
    }

    $scope.deleteConfirmed = function() {
      Todos.delete($scope.selectedTodo._id)
        .success(function(data) {
          $scope.todos = data;
          $scope.modalShown = !$scope.modalShown;
          $scope.selectedTodo = null;
        })
    };
  });
