(function() {
  'use strict';
  var Sequelize, config, db, env, fs, path, sequelize,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  env = process.env.NODE_ENV || 'dev';

  config = require(__dirname + '/../../config/config.json')[env];

  Sequelize = require('sequelize');

  console.log(config);

  sequelize = new Sequelize(config.backend_config, {
    logging: false
  });

  db = {};

  fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  }).forEach(function(file) {
    var model;
    model = sequelize["import"](path.join(__dirname, file));
    return db[model.name] = model;
  });

  Object.keys(db).forEach(function(modelName) {
    if (indexOf.call(db[modelName], "associate") >= 0) {
      return db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;

  db.Sequelize = Sequelize;

  module.exports = db;

}).call(this);
