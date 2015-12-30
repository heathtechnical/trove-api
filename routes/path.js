var express = require('express'),
    router  = express.Router();

var jwt         = require('jsonwebtoken'),
    express_jwt = require('express-jwt');

var env         = process.env.NODE_ENV || 'development',
    config      = require('../config/config.json')[env],
    models      = require('../models');

require('date-util');

router.use(express_jwt({ secret: config.token_secret }));

router.get('/', function(req, res, next) {
    // Get agent object
    models.Peer.find({ where: { id: req.user.id } }).then(function(peer){
        if(req.query.source){
            peer.getPaths({ where: { source: req.query.source } }).then(function(path){
                return res.json(path[0] || false);
            }).catch(function(error){
                return next(error);
            });
        }else{

            peer.getPaths().then(function(paths){
                return res.json(paths);
            });
        }
    });
})

/*
 * POST / : Create new monitored path for requesting agent
 */
router.post('/', function(req, res, next) {
    var path_params = req.body;

    // Get agent object
    models.Peer.find({ where: { id: req.user.id }}).then(function(peer){
        peer.createPath({
            source: path_params.source,
            disabled: false
        }).then(function(path){
            return res.json(path);
        }).catch(function(error){
            return next(error);
        });
    });

});

/*
 * PATCH /:id : Update path object
 * TODO: restrict to user access only, clients dont need to disable/enable themselves
 */
router.patch('/:id', function(req, res, next) {
    var path_params = req.body;

    models.Path.findOne({ where: { id: req.params.id, PeerId: req.user.id } }).then(function(path){
            if("disabled" in path_params){
                path.disabled = path_params.disabled;
            }

            path.save().then(function(done){
                return res.json(done);
            }).catch(function(error) {
                return next(error);
            });
    });
});

router.get('/:id/metrics', function(req, res, next) {
    var sql = 'SELECT * FROM (SELECT ROW_NUMBER() OVER (PARTITION BY name ORDER BY "createdAt" DESC) AS r, t.* FROM "PathMetrics" t) x WHERE x.r = 1;';

    var type = req.query.type || 'latest';

    if(type == "latest"){
    }else if(type == "interval"){
        var params = {};

        params.names = [ "fs.used_blocks" ];

        if(req.query.start) params.start = new Date().strtotime(req.query.start);
        if(req.query.end) params.end = new Date().strtotime(req.query.end);
        if(req.query.interval) params.interval = req.query.interval;

        console.log(params);

        models.PathMetric.intervalSeries(params).spread(function(result, metadata) {
            return res.json(result);
        }).catch(function(error){
            return res.json(error);
        });
    }
});

router.patch('/:id/metrics', function(req, res, next) {
    var path_params = req.body;

    models.Path.findOne({ where: { id: req.params.id, PeerId: req.user.id } }).then(function(path){
        updates = [];
        for(var name in path_params){
            updates.push({ PathId: path.id, name: name, value: path_params[name] });
        }

        models.PathMetric.bulkCreate(updates).then(function() {
            return res.json(true);
        }).catch(function(e) {
            return next(e);
        });
    });
});

router.post('/_update', function(req, res, next) {
    var path_params = req.body;

    // Get agent object
    models.Peer.find({ where: { id: req.user.id }}).then(function(peer){
        models.Path.findOrCreate({ where: { PeerId: peer.id, source: path_params.source  }}).then(function(path){
            return res.json(path);
        });
    });
})

module.exports = router;
