(function() {
  var User, bob, should;

  should = require('should');

  User = require('../../models').User;

  bob = User.build({
    username: 'bob',
    password: 'foo'
  });

  describe('Model: User', function() {
    before(function() {
      return User.sync({
        force: true
      });
    });
    describe('Username', function() {
      it('should be set', function() {
        return bob.username.should.equal('bob');
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
        return bob.password.should.not.equal('foo');
      });
      return it('should be encrypted', function() {
        return bob.encryptPassword('foo').should.equal(bob.password);
      });
    });
    return describe('Database CRUD', function() {
      it('should create ok', function() {
        bob.username = 'bob';
        bob.password = 'foo';
        return bob.save().then(function(user) {
          return should.exist(user);
        });
      });
      it('should read ok', function() {
        return User.findOne({
          where: {
            username: 'bob'
          }
        }).then(function(bob) {
          return should.exist(bob);
        });
      });
      return it('should update ok', function() {
        bob.username = 'brian';
        return bob.save().then(function(user) {
          return user.username.should.equal('brian');
        });
      });
    });
  });

}).call(this);
