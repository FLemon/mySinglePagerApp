angular.module('todoService', [])

  .factory('Todos', function($http, User) {
    console.log("todo services");
    return {
      get: function() {
        return $http.get('api/todos');
      },
      create: function(todoData) {
        return $http.post('api/todos', todoData, { headers: { 'Authorization': 'Bearer '+ User.token } });
      },
      delete: function(id) {
        return $http.delete('api/todos/' + id, { headers: { 'Authorization': 'Bearer '+ User.token } });
      }
    }
  });
