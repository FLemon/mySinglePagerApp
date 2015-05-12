// setup ===================
// Initializing system variables
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var app = express();

var db = require('./config/db');

mongoose.connect(db.url);
require('./config/passport')(passport);

app.configure(function() {
  app.use(passport.initialize());
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

require('./routes')(app, passport);

module.exports = app;
