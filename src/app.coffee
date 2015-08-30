express = require 'express'
app = express()
bodyParser = require 'body-parser'
passport = require 'passport'
BasicStrategy = require('passport-http').BasicStrategy
fs = require 'fs'

console.log "Trove API Service"

# Setup middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(passport.initialize())

passport.use new BasicStrategy(
  (username, password, callback) ->
    return callback(null, { username: username, is_user: "no" })
)

global_router = express.Router()

# Load modules & register controllers
console.log 'Loading modules:'
fs.readdirSync('./build/modules').forEach (file) ->
  console.log '  -> ' + file + ' routes:'

  module_router = express.Router()
  module = require './modules/' + file

  Object.keys(module.routes).forEach (route) ->
    console.log "    * " + module.routes[route].method + ' ' + route
    module_router[module.routes[route].method](route, module.routes[route].fn)

  global_router.use module.mount, module_router

# Mount router under /v1
app.use '/v1', passport.authenticate('basic', { session: false }), global_router

app.listen 4000
