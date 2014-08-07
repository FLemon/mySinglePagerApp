// model ======================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  text: { type: String, required: 'Please put in valid {PATH}!' }
})

module.exports = mongoose.model('Todo', todoSchema);
