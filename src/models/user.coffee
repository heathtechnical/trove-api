crypto = require 'crypto'

module.exports = (sequelize, DataTypes) ->
  User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { notEmpty: true } },
    password: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { notEmpty: true },
      set: (password) ->
        this.salt = this.makeSalt()
        this.setDataValue('password', this.encryptPassword(password))
    },
    salt: { type: DataTypes.STRING }
  }, {
    instanceMethods: {
      makeSalt: () ->
        return crypto.randomBytes(16).toString('base64')
      encryptPassword: (password) ->
        return '' if !password || !this.salt
        salt = new Buffer(this.salt, 'base64')
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64')
    }
  })

  return User
