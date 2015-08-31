should = require 'should'

User = require('../../models').User

bob = User.build(
  username: 'bob'
  password: 'foo'
)

describe 'Model: User', () ->
  before () ->
    User.sync({ force: true })

  describe 'Username', () ->
    it 'should be set', () ->
      bob.username.should.equal 'bob'

    it 'should not be null', () ->
      bob.username = null
      bob.validate().then((err)-> should.exist(err))

  describe 'Password', () ->
    it 'should not be plaintext', () ->
      bob.password.should.not.equal 'foo'

    it 'should be encrypted', () ->
      bob.encryptPassword('foo').should.equal bob.password

  describe 'Database CRUD', () ->
    it 'should create ok', () ->
      bob.username = 'bob'
      bob.password = 'foo'
      bob.save().then((user) -> should.exist(user))

    it 'should read ok', () ->
      User.findOne({ where: { username: 'bob' } }).then((bob) ->
        should.exist(bob)
      )

    it 'should update ok', () ->
      bob.username = 'brian'
      bob.save().then((user) -> user.username.should.equal('brian'))

#    it 'should delete ok', () ->
#      bob.destroy().then(() ->
#        User.findOne({ where: { username: 'brian' } }).then((found) ->
#          should.not.exist(found)
#        )
#      )
