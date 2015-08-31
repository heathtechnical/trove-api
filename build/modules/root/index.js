(function() {
  var pkg, routes;

  pkg = require(__dirname + '/../../../package.json');

  routes = {
    '/': {
      method: 'get',
      fn: function(req, res) {
        if (req.params.fail != null) {
          return res.status(400).json({
            success: 'no'
          });
        }
        return res.json({
          name: pkg.description,
          version: pkg.version
        });
      }
    }
  };

  module.exports = {
    mount: '/',
    routes: routes
  };

}).call(this);
