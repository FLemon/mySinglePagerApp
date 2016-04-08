// model ======================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likeSchema = new Schema({
  text: {
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

likeSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updatedAt = currentDate;

  if (!this.createdAt)
    this.createdAt = currentDate;

  next();
})

likeSchema.index({
    userEmail: 1,
    text: 1
  },{
    unique: true
  }
)

module.exports = mongoose.model('Like', likeSchema);
