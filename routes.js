// load the todo model
var Todo = require('./server/models/todos');
var Twit = require('./server/models/twits');
var Git = require('./server/models/git');
var config = require('config');

module.exports = function(app, passport, wss) {
  // API routes ===============
  var cachedTwits = [];
  var delayTime = config.get('general.nextTwit.delayTime');
  var user;

  var returnTwits = function(res) {
    res.set("Access-Control-Allow-Origin", "*")
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

  app.post('/api/todos', passport.authenticate('bearer', { session: false }),
    function(req, res) {
      Todo.create({
        text: req.body.text,
        userEmail: req.body.userEmail,
        done: false
      }, function(err, todo) {
        if (err) {
          var err_msg = (err.code === 11000 || err.code === 11001) ?
            'Already exists!' : err.errors.text.message;
          res.json(400, { message: err_msg });
        }

        wss.clients.forEach(function each(client) {
          var boardcastdata = {
            operation: "assert",
            data: todo
          }
          client.send(JSON.stringify(boardcastdata));
        });

        res.json(todo);
      });
  });

  app.delete('/api/todos/:todo_id', passport.authenticate('bearer', { session: false }),
    function(req, res) {
      Todo.remove({
        _id : req.params.todo_id
      }, function(err, todo) {
        if (err)
          res.send(err);

        wss.clients.forEach(function each(client) {
          var boardcastdata = {
            operation: 'delete',
            data: req.params.todo_id
          }
          client.send(JSON.stringify(boardcastdata));

          res.json(todo);
        });
      });
  });

  app.get('/api/git/commits', function(req, res) {
    new Git().repos.getCommits({
      user: "Flemon",
      repo: "mySinglePagerApp"
    }, function(err, commits) {
      if (err)
        res.send(err)
      res.json(commits)
    });
  });

  app.get('/api/git/user', function(req, res) {
    console.log("query email: "+req.query.email)
    new Git().search.users({
      q: (req.query.email === "undefined") ? "jin.xie@alliants.com" : req.query.email
    }, function(err, data) {
      if (err)
        res.send(err)
      else if (data.total_count > 0) {
        res.set("Access-Control-Allow-Origin", "*")
        res.json(data.items[0])
      } else {
        res.json("not registed github user")
      }
    });
  });

  app.get('/api/user', passport.authenticate('bearer', { session: false }),
    function(req, res) {
      res.json(req.user.google)
  });

  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails
  app.get('/auth/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
  );

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/'}),
    function(req, res) {
      res.send("<script>window.opener.$scope.token=\""+req.user.google.token+"\"; window.close()</script>")
    }
  );

  // =====================================
  // MAIN APP ROUTES =====================
  // =====================================
  // When the url doesnt match any of the above defined routes
  // send to index.html

  app.get('*', function(req, res) {
    var schema = req.headers["x-forwarded-proto"]

    if ((process.env.NODE_ENV === 'production' || process.env.PLATFORM == 'cloud9') && schema !== "https") {
      res.redirect("https://" + req.host + req.url)
    } else {
      res.sendfile('index.html')
    }
  });
};
