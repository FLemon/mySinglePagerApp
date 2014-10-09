angular.module('gitService', [])

  .factory('Git', function($http) {
    console.log("git service");

    return {
      user: function(user) {
        return $http.get('api/git/user/' + user);
      }
    } 
  });
