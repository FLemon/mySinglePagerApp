// setup ===================
// Initializing system variables
var express = require('express');
var mongoose = require('mongoose');
var app = express();

var db = require('./config/db');

mongoose.connect(db.url);

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

require('./routes')(app);

module.exports = app;
