// config/auth.js
// expose our config directly to our application using module.exports
var config = require('config');
var twitConfig = config.get("Twit.api")
var googleConfig = config.get("Google.api")
module.exports = {
  'twitterAuth' : {
    'apiKey'            : process.env.TWITTER_API_KEY || twitConfig.get("apiKey"),
    'apiSecret'         : process.env.TWITTER_API_SECRET || twitConfig.get("apiSecret"),
    'accessToken'       : process.env.TWITTER_ACCESS_TOKEN || twitConfig.get("accessToken"),
    'accessTokenSecret' : process.env.TWITTER_ACCESS_TOKEN_SECRET || twitConfig.get("accessSecret"),
    'callbackURL'       : process.env.TWITTER_CALLBACK || config.get("Twit.api.callbackURL")
  },
  'googleAuth' : {
    'clientId'          : process.env.GOOGLE_CLIENT_ID || googleConfig.get("clientId"),
    'clientSecret'      : process.env.GOOGLE_CLIENT_SECRET || googleConfig.get("clientSecret"),
    'callbackURL'       : process.env.GOOGLE_CLIENT_CALLBACK || config.get("Google.api.callbackURL")
  }
};
