var express = require('express'),
    router  = express.Router();

var jwt         = require('jsonwebtoken'),
    express_jwt = require('express-jwt');

var env         = process.env.NODE_ENV || 'development',
    config      = require('../config/config.json')[env],
    models      = require('../models');

router.use(express_jwt({ secret: config.token_secret }));

router.get('/', function(req, res, next) {
    return res.json({ here: "now" });
})

/*
 * POST / : Create new monitored path for requesting agent
 */
router.post('/', function(req, res, next) {
    var path_params = req.body;

    // Get agent object
    models.Peer.find({ where: { id: req.user.id }}).then(function(peer){
        models.Path.create({
            peer_id: peer.id,
            source: path_params.source,
            disabled: false
        }).then(function(path){
            peer.addPath(path).then(function(a){
                return res.json({ res: a });
            });
        });
    });

})

router.post('/_update', function(req, res, next) {

    return res.json({ success: true });
})

module.exports = router;
