var express = require('express'),
    router  = express.Router();

var jwt         = require('jsonwebtoken'),
    express_jwt = require('express-jwt');

var env         = process.env.NODE_ENV || 'development',
    config      = require('../config/config.json')[env],
    models      = require('../models');

router.use(express_jwt({ secret: config.token_secret }));

router.get('/', function(req, res, next) {
    models.Peer.findAll().then(function(peers){
        res.json(peers);
    });
});

router.get('/:handle', function(req, res, next) {
    models.Peer.find({ where: { handle: req.params.handle } }).then(function(peer){
        res.json(peer);
    });
});

router.patch('/:handle', function(req, res, next){
    var action = req.body.action;

    if(action == "disable"){
        models.Peer.find({ where: { handle: req.params.handle } }).then(function(peer){
            peer.disabled = true;
            return peer.save();
        }).then(function(peer){
            return res.json({ success: true });
        }).catch(function(err){
            return next(err);
        });
    }else if(action == "enable"){
        models.Peer.find({ where: { handle: req.params.handle } }).then(function(peer){
            peer.disabled = false;
            return peer.save();
        }).then(function(peer){
            return res.json({ success: true });
        }).catch(function(err){
            return next(err);
        });
    }else{
        return next("ERROR!");
    }

});

module.exports = router;
