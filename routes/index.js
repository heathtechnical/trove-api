var express = require('express'),
    router  = express.Router();

var jwt         = require('jsonwebtoken'),
    express_jwt = require('express-jwt');

var env         = process.env.NODE_ENV || 'development',
    config      = require('../config/config.json')[env],
    models      = require('../models');

/*
 * API Service Heartbeat
 * TODO: Needs to be moved into separate module
 */
setInterval(function() {
    models.Peer.upsert({
        handle: config.api_service_id,
        type: 'APISERVICE',
        heartbeat: new Date()
    }).catch(function(error){
        console.log(error);
    });
}, 60000);

/* POST /_auth
 * 
 *   Description: Authentication endpoint.
 *
 */
router.post('/_auth', function(req, res, next) {
    var type = req.query.type || "user";

    var token = {};

    // Define common success function
    var success = function(token){
        token = jwt.sign(token, config.token_secret);
        return res.json({ token: token });
    };

    // Define common error function
    var error = function(message){
        var e = new Error("Authentication error: " + message);
        e.status = 401;
        return next(e);
    };

    if(type == "agent"){
        var handle = req.body.handle;

        // Authenticate agent
        models.Peer.findOrCreate({ where: { handle: handle }, defaults: { type: 'AGENT', disabled: true, host: req.connection.remoteAddress } })
        .spread(function(peer, created){
            if(peer.disabled){
                return error("Agent access is disabled");
            }

            return success(peer);
        });
    }else if(type == "user"){
        var username = req.body.username;
        var password = req.body.password;

        if(!(username && password)) return error("Parameters username and password are required");

        // Authenticte client
        // TODO: Implement real authentication
        models.User.findOne({ where: { username: username } }).then(function(user){
            if(!user) return error("Invalid username/password");

            return success({ type: 'USER' });
        });
    }
});

router.get('/', express_jwt({ secret: config.token_secret }), function(req, res) {
    res.json({  user: req.user });
});

module.exports = router;
