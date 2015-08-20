angular.module('themeSwitchCtrl', [])
  .controller('themeSwitchController', function ($scope) {
    var $themeCSS = $('#theme-switch');

    $scope.buttonText = 'try out the new look!';

    $scope.switchTheme = function () {
      if ($themeCSS.attr('href').length > 0) {
        $themeCSS.attr('href', '');
        $scope.buttonText = 'try out the new look!';

        flames.disable();
      } else {
        $themeCSS.attr('href', '/stylesheets/new-theme.css');
        $scope.buttonText = 'I like the old one better';

        flames.enable();
      }
    };
  });
