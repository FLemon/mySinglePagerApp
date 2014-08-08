angular.module('twitCtrl', [])
  .controller('twitController', function($scope, $timeout, $interval, Twits) {
    console.log("twit controller");

    $scope.randomTwit = Twits.placeHolderTwit();

    var nextTwit = function(data) {
      var randomIndex = Math.floor(Math.random() * data.length);
      $scope.randomTwit = data[randomIndex];
    };

    Twits.get()
      .success(function(data) {
        console.log("success");
        $interval(function() { nextTwit(data.twitsCollection); }, data.delayTime);
      });
  });
