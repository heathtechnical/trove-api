(function() {
  var assert, root_routes, should;

  assert = require('assert');

  should = require('should');

  root_routes = require('../../modules/root');

  describe('module: root - routes', function() {
    return describe('index', function() {
      it('returns root structure', function() {
        return root_routes.routes['/'].fn({
          params: {}
        }, {
          json: function(data) {
            return assert.deepEqual(data, {
              name: 'fCrunch',
              version: '0.0.1'
            });
          }
        });
      });
      return it('fails correctly', function() {
        return root_routes.routes['/'].fn({
          params: {
            fail: true
          }
        }, {
          status: function(code) {
            assert.equal(code, 400);
            return this;
          },
          json: function(data) {
            return assert.deepEqual(data, {
              success: 'no'
            });
          }
        });
      });
    });
  });

}).call(this);
