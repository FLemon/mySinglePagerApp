angular.module('confirmDirective', [])
  .directive('ngConfirmRemove', function () {
    return {
      scope: {
        show: "=",
        todo: "=",
        confirm: "&"
      },
      replace: true,
      link: function(scope, element, attrs) {
        scope.dialogStyle = {};
        scope.imageStyle = {};
        if (attrs.width)
          scope.dialogStyle.width = attrs.width;
          scope.imageStyle.width = "300px";
        if (attrs.height)
          scope.dialogStyle.height = attrs.height;
          var imageHeight = (parseInt(attrs.height, 10)*0.8).toString()
          scope.imageStyle.height = imageHeight;
        scope.hideModal = function() {
          scope.show = false;
        };
      },
      templateUrl: '/templates/confirm-remove.html'
    };
  });
