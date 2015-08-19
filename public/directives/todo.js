angular.module('todoDirective', [])
  .directive('myTodos', function ($window) {
    return {
      link: function ($scope, element) {
        $scope.$evalAsync(function () {
          var $canvas = element.find('#flaming-canvas');
          $window.flames.init($canvas[0]);
        });
      },

      templateUrl: '/templates/my-todos.html'
    };
  });
