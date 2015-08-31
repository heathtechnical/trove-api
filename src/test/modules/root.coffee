should = require 'should'
root_routes = require '../../modules/root'

describe 'Module: root - routes', () ->
  describe 'index', () ->
    it 'returns root structure', () ->
      root_routes.routes['/'].fn({ params: {} }, {
        json: (data) ->
          data.should.have.property 'name'
          data.should.have.property 'version'
      })
