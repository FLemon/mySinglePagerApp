angular.module('twitDirective', [])
  .directive('myTwits', function() {
    return {
      templateUrl: '/templates/my-twits.html'
    };
  });
