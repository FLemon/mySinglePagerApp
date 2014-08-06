var config = require('config');
module.exports = {
  url: process.env.MONGOHQ_URL || config.get("DB.url")
}
