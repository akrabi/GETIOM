var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var geolib     = require('geolib');
var clusterfck = require('clusterfck');
var messages   = require('./models/messages.js');

var port = process.env.PORT || 8080;    // Server's port
var webAppPath = "../../";              // Path to client web application

// configure app
var app = express();
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure routers
var router = express.Router();
router.use(function(req, res, next) {
    // do logging
    console.log('Request routed...');
    //var lat1=40.798217025760515;
    //var lng1=-73.77439498901367;
    //var lat2=40.52006312552015;
    //var lng2=-74.1712760925293;
    //var rect = [
    //    {
    //        latitude: lat1,
    //        longitude: lng1
    //    },
    //    {
    //        latitude: lat1,
    //        longitude: lng2
    //    },
    //    {
    //        latitude: lat2,
    //        longitude: lng2
    //    },
    //    {
    //        latitude: lat2,
    //        longitude: lng1
    //    }
    //];
    //var point = {"latitude": "40.71660077", "longitude": "-73.95056784"};
    //console.log(geolib.isPointInside(point, rect));
    //next();
});


router.route('/filter/location/circle')
    .get(function(req, res, next) {
        console.log(req.query);
        var circleRadius = req.query.radius;
        var circleCenter = {latitude: req.query.lat, longitude: req.query.lng};
        if (!circleCenter || !circleRadius) next();
        res.json(messages.filter(function(message) {
            return geolib.isPointInCircle(message.location, circleCenter, circleRadius);
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
        res.json(messages.filter(function(message) {
            return geolib.isPointInside(message.location, rect);
        }));
    });

router.route('/filter/location/polygon')
    .get(function(req, res, next) {
        var polygon;
        res.json(messages.filter(function(message) {
            return geolib.isPointInside(message.location, polygon);
        }));
    });

router.route('/')
    .get(function(req, res, next) {
        res.json(messages);
    });

// Register routers
app.use('/messages', router);

// Register client side web app
app.use(express.static(webAppPath));

// Start the server
app.listen(port);
console.log('Node.js server started on port ' + port);





//var timeMetric = function (msg1, msg2) {
//    return Math.abs(msg1.time1 - msg2.time1); // return time difference (in milliseconds)
//}
//var threshold = 1800000; // 3hrs in milliseconds
//var clusters = clusterfck.hcluster(messages, timeMetric, clusterfck.AVERAGE_LINKAGE, threshold); //TODO save clusters somewhere