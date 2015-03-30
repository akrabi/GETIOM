var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var geolib     = require('geolib');

// Declare variables
var fs = require('fs');
//var messages = JSON.parse(fs.readFileSync('./models/10KMessages.json', 'utf8'));
//var messages = JSON.parse(fs.readFileSync('./models/5KMssages.json', 'utf8'));
//var messages = JSON.parse(fs.readFileSync('./models/1KMessages.json', 'utf8'));
//var messages = JSON.parse(fs.readFileSync('./models/100KNewFormat.json', 'utf8'));
var messages = JSON.parse(fs.readFileSync('./models/1KNewNEWNEWNEWFormat.json', 'utf8'));


var port = process.env.PORT || 8081;    // Server's port

// configure app
var app = express();
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function getMsgCoordinates(msg) {
    return {latitude: msg.geometry.coordinates[0], longitude: msg.geometry.coordinates[1]};
}

// configure routers
var router = express.Router();
router.use(function(req, res, next) {
    // do logging
    console.log('Request routed...');
    next();
});


router.route('/num')
    .get(function(req, res) {
        res.json({messagesNum: messages.length});
    });


router.route('/filter/location/circle')
    .get(function(req, res, next) {
        console.log(req.query);
        var circleRadius = req.query.radius;
        var circleCenter = {latitude: req.query.lat, longitude: req.query.lng};
        if (!circleCenter || !circleRadius) next();
        res.json(messages.filter(function(msg) {
            return geolib.isPointInCircle(getMsgCoordinates(msg), circleCenter, circleRadius);
        }));
    });


router.route('/filter/location/rectangle')
    .get(function(req, res, next) {
        var lat1 = req.query.lat1;
        var lng1 = req.query.lng1;
        var lat2 = req.query.lat2;
        var lng2 = req.query.lng2;
        if (!lat1 || !lng1 || !lat2 || !lng2) next();
        var rect = [
            {
                latitude: lat1,
                longitude: lng1
            },
            {
                latitude: lat1,
                longitude: lng2
            },
            {
                latitude: lat2,
                longitude: lng2
            },
            {
                latitude: lat2,
                longitude: lng1
            }
        ];
        res.json(messages.filter(function(msg) {
            return geolib.isPointInside(getMsgCoordinates(msg), rect);
        }));
    });

router.route('/filter/location/polygon')
    .get(function(req, res, next) {
        var polygon;
        res.json(messages.filter(function(msg) {
            return geolib.isPointInside(getMsgCoordinates(msg), polygon);
        }));
    });

router.route('/')
    .get(function(req, res, next) {
        res.json(messages);
    });

// Register routers
app.use('/messages', router);

// Start the server
app.listen(port);
console.log('Node.js server started on port ' + port);