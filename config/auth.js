// config/auth.js
// expose our config directly to our application using module.exports
var config = require('config');
module.exports = {
  'twitterAuth' : {
    'apiKey'            : process.env.TWITTER_API_KEY,
    'apiSecret'         : process.env.TWITTER_API_SECRET,
    'accessToken'       : process.env.TWITTER_ACCESS_TOKEN,
    'accessTokenSecret' : process.env.TWITTER_ACCESS_TOKEN_SECRET,
    'callbackURL'       : config.get("Twit.api.callbackURL")
  }
};
