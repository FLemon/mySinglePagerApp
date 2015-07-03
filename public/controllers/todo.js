angular.module('todoCtrl', [])
  .controller('todoController', function($scope, $http, Todos) {
    console.log("todo controller");

    var addTodo = function(todo) {
      $scope.todos.push(todo)
    }

    var removeTodo = function(todoId) {
      for (var i = 0; i < $scope.todos.length; i++) {
        if ($scope.todos[i]._id === todoId)
          $scope.todos.splice(i, 1)
      }
    }

    var host = window.document.location.host
    var wsPrefix = ''

    if (host.match(/^127/)) {
      prefix = 'ws://'
    } else {
      prefix = 'wss://'
    }

    var wsHost = prefix + host

    console.log("ws endpoint:" + wsHost)
    var ws = new WebSocket(wsHost)
    ws.onmessage = function (event) {
      var receivedData = JSON.parse(event.data)
      console.log("todo created:"+ receivedData);
      if (receivedData.operation === "assert")
        addTodo(receivedData.data)
      else if (receivedData.operation === "delete")
        removeTodo(receivedData.data)
    };

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
          $scope.modalShown = !$scope.modalShown;
          $scope.selectedTodo = null;
        })
    };
  });
