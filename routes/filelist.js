var express = require('express'),
    router  = express.Router();

var jwt         = require('jsonwebtoken'),
    express_jwt = require('express-jwt');

var models      = require('../models');
