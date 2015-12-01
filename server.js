var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser');


var root        = require('./routes/index'),
    peer        = require('./routes/peer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 3000;

app.use('/', root);
app.use('/peer', peer);

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.json({ message: err.message, error: {} });
});

app.listen(port);
console.log('API Service listening on port ' + port);
