assert = require 'assert'
should = require 'should'
root_routes = require '../../modules/root'

describe 'module: root - routes', () ->
  describe 'index', () ->
    it 'returns root structure', () ->
      root_routes.routes['/'].fn({ params: {} }, {
        json: (data) ->
          assert.deepEqual(data, { name: 'fCrunch', version: '0.0.1' })
      })
    it 'fails correctly', () ->
      root_routes.routes['/'].fn({ params: { fail: true } }, {
        status: (code) ->
          assert.equal(code, 400)
          return this
        json: (data) ->
          assert.deepEqual(data, { success: 'no' })
      })
