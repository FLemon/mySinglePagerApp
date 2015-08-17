// model ======================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  text: {
    type: String,
    required: 'Please put in valid {PATH}!',
    unique: true
  },
  trackId: {
    type: String,
    required: 'Please put in valid {PATH}!',
    unique: true
  },
  userEmail: {
    type: String,
    required: 'Please put in valid {PATH}!',
    unique: false
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date
  }
})

todoSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updatedAt = currentDate;

  if (!this.createdAt)
    this.createdAt = currentDate;

  next();
})

module.exports = mongoose.model('Todo', todoSchema);
