angular.module('twitService', [])

  .factory('Twits', function($http) {
    return {
      all: function() {
        console.log("twit services");
        return $http.get('api/twits');
      },
      placeHolder: function() {
        return 'Yo! Jin has something to say';
      }
    }
  });
