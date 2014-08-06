angular.module('twitCtrl', [])
  .controller('twitController', function($scope, $timeout, $interval, Twits) {
    console.log("twit controller");
    $scope.twits = [];

    var next_twit = function() {
      var twits = $scope.twits;
      var random_index = Math.floor(Math.random() * twits.length);
      $scope.random_twit = twits[random_index].text;
    };

    Twits.get()
      .success(function(data) {
        var random_index = Math.floor(Math.random() * data.length);
        $scope.random_twit = data[random_index].text;
        $scope.twits = data;
        console.log(data.length);
      });

    $interval(next_twit, 5000); 
  });
