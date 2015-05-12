var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new Schema({
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hash(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compare(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
