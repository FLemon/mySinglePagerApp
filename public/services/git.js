angular.module('gitService', [])

  .factory('Git', function($http) {
    console.log("git service");

    return {
      user: function(email) {
        return $http.get('api/git/user?email=' + email);
      }
    } 
  });
