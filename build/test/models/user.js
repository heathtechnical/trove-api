(function() {
  var User, assert, bob, should;

  assert = require('assert');

  should = require('should');

  User = require('../../models').User;

  bob = User.build({
    username: 'bob',
    password: 'foo'
  });

  describe('User', function() {
    before(function() {
      return User.sync({
        force: true
      }).then(function() {
        return console.log("Done");
      });
    });
    describe('Username', function() {
      it('should be set', function() {
        return assert.equal(bob.username, 'bob');
      });
      return it('should not be null', function() {
        bob.username = null;
        return bob.validate().then(function(err) {
          return should.exist(err);
        });
      });
    });
    describe('Password', function() {
      it('should not be plaintext', function() {
        return assert.notEqual(bob.password, 'foo');
      });
      return it('should be encrypted', function() {
        return assert.equal(bob.encryptPassword('foo'), bob.password);
      });
    });
    return describe('Save', function() {
      return it('should work', function() {
        bob.username = '';
        return bob.save().then(function(user) {
          return should.exist(user);
        });
      });
    });
  });

}).call(this);
