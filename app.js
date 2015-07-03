// setup ===================
// Initializing system variables

var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    app = express(),
    db = require('./config/db');
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8080});

mongoose.connect(db.url);
require('./config/passport')(passport);

app.configure(function() {
  app.use(passport.initialize());
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

require('./routes')(app, passport, wss);

module.exports = app;
