angular.module('gitService', [])
  .factory('Git', function($http) {
    console.log("git service");

    var Git = {}

    Git.userName = ''
    Git.avatarUrl = ''
    Git.htmlUrl = ''

    Git.sync = function(email) {
      console.log("email: " + email)
      $http.get('api/git/user?email=' + email).success(function(data) {
        console.log("git data: "+data)
        Git.userName = data.login
        Git.avatarUrl = data.avatar_url
        Git.htmlUrl = data.html_url
      })

    }
    return Git
  });
