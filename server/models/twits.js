function Twit() {}

Twit.prototype.get = function(req, res) {
  var configAuth = require('../../config/auth');
  var Twit = require('twit');
  var T = new Twit({
    consumer_key:         configAuth.twitterAuth.apiKey, 
    consumer_secret:      configAuth.twitterAuth.apiSecret,
    access_token:         configAuth.twitterAuth.accessToken,
    access_token_secret:  configAuth.twitterAuth.accessTokenSecret
  });
  var params = { screen_name: 'shitjinsays', count: 200 };

  T.get('statuses/user_timeline', params, function (err, data, response) {
    if (err) 
      res.send(err)
    res.json(data);
  });
} 

module.exports = Twit;
