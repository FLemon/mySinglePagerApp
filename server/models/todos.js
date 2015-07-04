// model ======================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  text: {
    type: String,
    required: 'Please put in valid {PATH}!',
    unique: true
  },
  userEmail: {
    type: String,
    required: 'Please put in valid {PATH}!',
    unique: false
  }
})

module.exports = mongoose.model('Todo', todoSchema);
