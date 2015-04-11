var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var geolib     = require('geolib');

// Declare variables
var fs = require('fs');
var messages = JSON.parse(fs.readFileSync('./models/messages.json', 'utf8')).features;


var port = process.env.PORT || 8081;    // Server's port

// configure app
var app = express();
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function featuresArrayToCollection(featuresArray) {
    return {
        type: 'FeatureCollection',
        features: featuresArray
    };
}

function getMsgCoordinates(msg) {
    return {latitude: msg.geometry.coordinates[0], longitude: msg.geometry.coordinates[1]};
}

function random (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
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
        res.json({pointsNum: messages.length});
    });


router.route('/samples')
    .get(function(req, res) {
        var samples= [];
        for (var i=0; i<100; ++i) {
            var rand = random(0,messages.length);
            samples.push(messages[rand]);
        }
        res.json(featuresArrayToCollection(samples));
    });

router.route('/filter/location/circle')
    .get(function(req, res, next) {
        console.log(req.query);
        var circleRadius = req.query.radius;
        var circleCenter = {latitude: req.query.lat, longitude: req.query.lng};
        if (!circleCenter || !circleRadius) next();
        res.json(featuresArrayToCollection(messages.filter(function(msg) {
            return geolib.isPointInCircle(getMsgCoordinates(msg), circleCenter, circleRadius);
        })));
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
        res.json(featuresArrayToCollection(messages.filter(function(msg) {
            return geolib.isPointInside(getMsgCoordinates(msg), rect);
        })));
    });

router.route('/filter/location/polygon')
    .get(function(req, res, next) {
        var points = JSON.parse(req.query.points);
        var polygon = points.map(function(point) {
            return {
                latitude: point[0],
                longitude: point[1]
            }
        });
        res.json(featuresArrayToCollection(messages.filter(function(msg) {
            return geolib.isPointInside(getMsgCoordinates(msg), polygon);
        })));
    });

router.route('/')
    .get(function(req, res, next) {
        res.json(featuresArrayToCollection(messages));
    });

// Register routers
app.use('/messages', router);

// Start the server
app.listen(port);
console.log('Node.js server started on port ' + port);