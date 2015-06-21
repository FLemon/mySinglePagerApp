angular.module('userService', [])
  .factory('User', function($http, $cookieStore, Git) {
    console.log("user service")

    var User = {}

    User.name = ''
    User.email = ''

    User.sync = function() {
      var token = $cookieStore.get('access_token')
      console.log("use it:" + token)
      $http.get('/api/user', { headers: { 'Authorization': 'Bearer '+ token } }).success(function(data) {
        console.log(User)
        User.name = data.name
        User.email = data.email
        User.syncGit(User.email)
      })
    }
    User.syncGit = function(email) {
      Git.sync(email)
    }

    User.sync()
    return User
  })
