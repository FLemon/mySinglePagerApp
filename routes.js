// load the todo model
var Todo = require('./server/models/todos');
var Twit = require('./server/models/twits');
var config = require('config');

module.exports = function(app) {
  // API routes ===============
  var cachedTwits = [];
  var delayTime = config.get('general.nextTwit.delayTime');

  var returnTwits = function(res) {
    res.json({twitsCollection: cachedTwits, delayTime: delayTime});
  }

  var cacheTwits = function(twitsCollection, res) {
    cachedTwits = twitsCollection;
    returnTwits(res);
  }

  app.get('/api/twits', function(req, res) {
    if (cachedTwits.length !== 0)
      returnTwits(res);
    else
      new Twit().get(cacheTwits, res);
  });

  app.get('/api/todos', function(req, res) {
    Todo.find(function(err, todos) {
      if (err) 
        res.send(err)
      res.json(todos);
    });
  });

  app.post('/api/todos', function(req, res) {
    Todo.create({
      text: req.body.text,
      done: false
    }, function(err, todo) {
      if (err) {
        var err_msg = (err.code === 11000 || err.code === 11001) ?
          'Already exists!' : err.errors.text.message;
        res.json(400, { message: err_msg });
      }

      Todo.find(function(err, todos) {
        if (err) 
          res.send(err)
        res.json(todos);
      });
    });
  });

  app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
      _id : req.params.todo_id 
    }, function(err, todo) {
      if (err) 
        res.send(err);

      Todo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos);
      });
    });
  });

  //App route
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });
};
