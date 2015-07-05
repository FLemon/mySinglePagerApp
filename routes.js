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
        res.send(err);
      else
        res.json(todos);
    });
  });

  app.post('/api/todos', passport.authenticate('bearer', { session: false }), function(req, res) {
    var restriction = config.get('general.todos.assertionRestriction'),
        now = new Date(),
        timeBeforeRestriction = new Date(),
        restrictionMinutes = restriction.minutes;

    timeBeforeRestriction.setMinutes(now.getMinutes() - restrictionMinutes);

    Todo.count({userEmail: req.user.google.email, createdAt: { $gte: timeBeforeRestriction}}, function (err, count) {
      if (err) {
        res.send(err)
      } else {
        var ResctrictionNumber = restriction.number;
        if (count >= ResctrictionNumber) {
          Todo.find().sort('-createdAt').limit(5).exec(function (err, todos) {
            if (err) {
              res.send(err)
            } else {
              var firstWithinTimeRange = todos[4].createdAt
              var RestrictionRefreshTime = firstWithinTimeRange.setMinutes(firstWithinTimeRange.getMinutes() + restrictionMinutes);
              var milliSecondsLeft = RestrictionRefreshTime - now;
              var minutesLeft = Math.floor(milliSecondsLeft / 60000);
              var secondsLeft = ((milliSecondsLeft % 60000) / 1000).toFixed(0);
              err_msg = ResctrictionNumber + " items/" + restrictionMinutes + "mins restriction reached, delete some or wait for " + minutesLeft + "min " + secondsLeft + "sec";
              res.json(400, { message: err_msg});
            }
          })
        } else {
          Todo.create({
            text: req.body.text,
            userEmail: req.user.google.email,
            done: false
          }, function(err, todo) {
            if (err) {
              var err_msg = (err.code === 11000 || err.code === 11001) ?
                'Already exists!' : err.errors.text.message;
              res.json(400, { message: err_msg });
            } else {
              wss.clients.forEach(function each(client) {
                var boardcastdata = {
                  operation: "assert",
                  data: todo
                }
                client.send(JSON.stringify(boardcastdata));
              });

              res.json(todo);
            }
          });
        }
      }
    })
  });

  app.delete('/api/todos/:todo_id', passport.authenticate('bearer', { session: false }), function(req, res) {
    var todo_id = req.params.todo_id;

    Todo.findById(todo_id, function(err, todo) {
      if (err) {
        res.send(err);
      } else if (todo) {
        if (todo.userEmail !== req.user.google.email) {
          res.json(400, { message: "Oi, it's not yours" });
        } else {
          Todo.remove({
            _id : todo_id
          }, function(err, todo) {
            if (err) {
              res.send(err);
            } else {
              wss.clients.forEach(function each(client) {
                var boardcastdata = {
                  operation: 'delete',
                  data: req.params.todo_id
                }
                client.send(JSON.stringify(boardcastdata));

                res.json(todo);
              });
            }
          });
        }
      } else {
        res.json("todo is null");
      }
    });
  });

  app.get('/api/git/commits', function(req, res) {
    new Git().repos.getCommits({
      user: "Flemon",
      repo: "mySinglePagerApp"
    }, function(err, commits) {
      if (err)
        res.send(err)
      else
        res.json(commits)
    });
  });

  app.get('/api/git/user', function(req, res) {
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

  app.get('/api/user', passport.authenticate('bearer', { session: false }), function(req, res) {
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
