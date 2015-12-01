var express = require('express'),
    router  = express.Router();

var jwt         = require('jsonwebtoken'),
    express_jwt = require('express-jwt');

var env         = process.env.NODE_ENV || 'development',
    config      = require('../config/config.json')[env],
    models      = require('../models');

/*
 * API Service Heartbeat
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

    var success = function(token){
        token = jwt.sign(token, config.token_secret);
        return res.json({ token: token });
    };

    var error = function(message){
        var e = new Error("Authentication error: " + message);
        e.status = 401;
        return next(e);
    };

    if(type == "agent"){
        var handle = req.body.handle;

        models.Peer.findOrCreate({ where: { handle: handle }, defaults: { type: 'AGENT', disabled: true } })
        .spread(function(peer, created){
            if(peer.disabled){
                return res.json({ disabled: true, peer: peer });
            }

            return success({ type: 'AGENT' });
        });
    }else if(type == "user"){
        var username = req.body.username;
        var password = req.body.password;

        if(!(username && password)) return error("Parameters username and password are required");

        models.User.findOne({ where: { username: username } }).then(function(user){
            if(!user) return error("Invalid username/password");

            return success({ type: 'USER' });
        });
    }


/*    var username = req.body.username;
    var password = req.body.password;
    var handle = req.body.handle;

    var auth_error = function(message){
    };

    if(!(username && password) && !handle){
        return auth_error("Username/password parameters not supplied");
    }

    if(handle){
        models.Peer.findOne({ where: { handle: handle }}).then(function(peer){
            if(!peer){
                models.Peer.upsert({ handle: handle, type: 'AGENT', disabled: true })
                return res.json({ registration: "pending" });
            }

            if(peer.disabled){
                return res.json({ registration: "pending" });
            }

            // Generate token and return
            var token = jwt.sign({
                type   : 'AGENT',
                handle : handle
            }, config.token_secret);

            res.json({ token: token });
        });
    }

    // TODO: Implement proper auth w/ app secret
    models.User.find({ where: { username: username } }).then(function(result){
        if(!result){
            return auth_error("Incorrect username/password supplied");
	}

        // Generate token and return
        var token = jwt.sign({
            type     : 'USER',
            username : username
        }, config.token_secret);

        res.json({ token: token });

    }).catch(function(error){
        return auth_error("Database error");
    });*/
});

router.get('/', express_jwt({ secret: config.token_secret }), function(req, res) {
    res.json({  user: req.user });
});

module.exports = router;
