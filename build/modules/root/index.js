(function() {
  var routes;

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
          name: 'fCrunch',
          version: '0.0.1'
        });
      }
    }
  };

  module.exports = {
    mount: '/',
    routes: routes
  };

}).call(this);
