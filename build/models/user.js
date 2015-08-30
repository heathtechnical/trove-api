(function() {
  var crypto;

  crypto = require('crypto');

  module.exports = function(sequelize, DataTypes) {
    var User;
    User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        set: function(password) {
          this.salt = this.makeSalt();
          return this.setDataValue('password', this.encryptPassword(password));
        }
      },
      salt: {
        type: DataTypes.STRING
      }
    }, {
      instanceMethods: {
        makeSalt: function() {
          return crypto.randomBytes(16).toString('base64');
        },
        encryptPassword: function(password) {
          var salt;
          if (!password || !this.salt) {
            return '';
          }
          salt = new Buffer(this.salt, 'base64');
          return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
        }
      }
    });
    return User;
  };

}).call(this);
