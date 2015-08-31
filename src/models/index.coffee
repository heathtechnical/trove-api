'use strict'

fs = require 'fs'
path = require 'path'
env = process.env.NODE_ENV || 'dev'
config = require(__dirname + '/../../config/config.json')[env]
Sequelize = require 'sequelize'

sequelize = new Sequelize(config.backend_config, { logging: false })
db = {}

fs.readdirSync(__dirname).filter((file) ->
  return (file.indexOf('.') != 0) && (file != 'index.js')
).forEach((file) ->
  model = sequelize.import(path.join(__dirname, file))
  db[model.name] = model
)

Object.keys(db).forEach((modelName) ->
  if "associate" in db[modelName]
    db[modelName].associate(db)
)

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
