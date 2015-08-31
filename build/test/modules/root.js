(function() {
  var root_routes, should;

  should = require('should');

  root_routes = require('../../modules/root');

  describe('Module: root - routes', function() {
    return describe('index', function() {
      return it('returns root structure', function() {
        return root_routes.routes['/'].fn({
          params: {}
        }, {
          json: function(data) {
            data.should.have.property('name');
            return data.should.have.property('version');
          }
        });
      });
    });
  });

}).call(this);
