var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    app = express(),
    WebSocketServer = require('ws').Server,
    port = Number(process.env.PORT || 5000),
    db = require('./config/db');

mongoose.connect(db.url);
require('./config/passport')(passport);

app.configure(function() {
  app.use(passport.initialize());
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

server = http.createServer(app);
server.listen(port, function() {
  console.log("Listening on " + port);
});

wss = new WebSocketServer({server: server});
require('./routes')(app, passport, wss);
