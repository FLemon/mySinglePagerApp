function Twit() {}

Twit.prototype.get = function(cacheTwits, res) {
  var config = require('config');
  var configAuth = require('../../config/auth');
  var Twit = require('twit');

  var T = new Twit({
    consumer_key:         configAuth.twitterAuth.apiKey, 
    consumer_secret:      configAuth.twitterAuth.apiSecret,
    access_token:         configAuth.twitterAuth.accessToken,
    access_token_secret:  configAuth.twitterAuth.accessTokenSecret
  });
  var params = {
    screen_name: config.get('Twit.api.userName'),
    count: config.get('Twit.api.maxTwitsCount')
  };

  T.get('statuses/user_timeline', params, function (err, data, response) {
    var twitsCollection = [];
    if (err) 
      twitsCollection = ['Oops...something went wrong'];

    twitsCollection = data.map(function(twit) { return twit.text; });
    cacheTwits(twitsCollection, res);
  });
} 

module.exports = Twit;
