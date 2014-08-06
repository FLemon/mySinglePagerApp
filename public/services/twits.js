angular.module('twitService', [])

  .factory('Twits', function($http) {
    return {
      get: function() {
        console.log("twit services");
        return $http.get('api/twits');
      }
    }
  });
