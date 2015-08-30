assert = require 'assert'
should = require 'should'

User = require('../../models').User

bob = User.build(
  username: 'bob'
  password: 'foo'
)

describe 'User', () ->
  before () ->
    User.sync({ force: true }).then(() ->
      console.log "Done"
    )

  describe 'Username', () ->
    it 'should be set', () ->
      assert.equal bob.username, 'bob'

    it 'should not be null', () ->
      bob.username = null
      bob.validate().then((err)-> should.exist(err))

  describe 'Password', () ->
    it 'should not be plaintext', () ->
      assert.notEqual bob.password, 'foo'
    it 'should be encrypted', () ->
      assert.equal(bob.encryptPassword('foo'), bob.password)
  describe 'Save', () ->
    it 'should work', () ->
      bob.username = ''
      bob.save().then((user)->
        should.exist(user)
      )
