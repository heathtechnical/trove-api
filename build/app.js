(function() {
  var BasicStrategy, app, bodyParser, express, fs, global_router, passport;

  express = require('express');

  app = express();

  bodyParser = require('body-parser');

  passport = require('passport');

  BasicStrategy = require('passport-http').BasicStrategy;

  fs = require('fs');

  console.log("Trove API Service");

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(passport.initialize());

  passport.use(new BasicStrategy(function(username, password, callback) {
    return callback(null, {
      username: username,
      is_user: "no"
    });
  }));

  global_router = express.Router();

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
