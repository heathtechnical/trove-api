(function() {
  var BasicStrategy, User, app, bodyParser, express, fs, global_router, passport;

  express = require('express');

  fs = require('fs');

  bodyParser = require('body-parser');

  passport = require('passport');

  BasicStrategy = require('passport-http').BasicStrategy;

  User = require('./models').User;

  app = express();

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(passport.initialize());

  passport.use(new BasicStrategy(function(username, password, done) {
    return User.findOne({
      where: {
        username: username
      }
    }).then(function(user) {
      if (!user) {
        return done(null, false);
      }
      if (user.encryptPassword(password) !== user.password) {
        return done(null, false);
      }
      return done(null, user);
    });
  }));

  global_router = express.Router();

  console.log("Trove API Service");

  console.log('Loading modules:');

  fs.readdirSync('./build/modules').forEach(function(file) {
    var module, module_router;
    console.log('  -> ' + file + ' routes:');
    module_router = express.Router();
    module = require('./modules/' + file);
    Object.keys(module.routes).forEach(function(route) {
      console.log("    * " + module.routes[route].method + ' ' + route);
      return module_router[module.routes[route].method](route, module.routes[route].fn);
    });
    return global_router.use(module.mount, module_router);
  });

  app.use('/v1', passport.authenticate('basic', {
    session: false
  }), global_router);

  app.listen(4000);

}).call(this);
