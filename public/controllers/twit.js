angular.module('twitCtrl', [])
  .controller('twitController', function($scope, $timeout, $interval, Twits) {
    console.log("twit controller");
    $scope.random_twit = 'Wait! Jin has say something';

    var next_twit = function(data) {
      var random_index = Math.floor(Math.random() * data.length);
      $scope.random_twit = data[random_index];
    };

    Twits.get()
      .success(function(data) {
        console.log("success");
        $interval(function() { next_twit(data); }, 8000);
      });
  });
