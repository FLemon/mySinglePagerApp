angular.module('twitCtrl', [])
  .controller('twitController', function($scope, $timeout, $interval, Twits) {
    console.log("twit controller");
    $scope.twits = [];

    var next_twit = function(data) {
      var random_index = Math.floor(Math.random() * data.length);
      console.log("next index:" + random_index);
      $scope.random_twit = data[random_index].text;
    };

    Twits.get()
      .success(function(data) {
        console.log("success");
        next_twit(data);
        $interval(function() { next_twit(data); }, 10000);
      });
  });
