var http       = require('http');
var bl         = require('bl');
var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var geolib     = require('geolib');
var clusterfck = require('clusterfck');
var terraformer = require('terraformer');
//var hcluster   = require('./added_modules/hcluster');

// Configuration parameters
var restURL = "http://localhost:8081"
var port = process.env.PORT || 8080;    // Server's port
var webAppPath = "../frontend";         // Path to client web application

// Declare global app variables
var messages = null;
var clusters = [];


// configure app
var app = express();
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// function to recieve filtered messages from REST API
function getFilteredMessages(url) {
    console.log(url);
    http.get(url, function(res) {
        var chunks = '';

        res.on('data', function(chunk) {
            chunks += chunk;
        });

        res.on('end', function() {
            messages = JSON.parse(chunks);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
}


// configure routers
var router = express.Router();
router.use(function(req, res, next) {
    // do logging
    console.log('Request routed...');
    next();
});


router.route('/messages/num')
    .get(function(req, response) {
        console.log('Retrieving number of messages in DB...');
        var url = restURL+'/messages/num';
        http.get(url, function(res) {
            var chunks = '';

            res.on('data', function(chunk) {
                chunks += chunk;
            });

            res.on('end', function() {
                response.json(JSON.parse(chunks));
            });
        }).on('error', function(e) {
            console.log("Got error: ", e);
        });
    });

router.route('/filter')
    .get(function(req, response) {
        console.log('Handling filter request...');
        var url = restURL+'/messages';
        http.get(url, function(res) {
            var chunks = '';

            res.on('data', function(chunk) {
                chunks += chunk;
            });

            res.on('end', function() {
                messages = JSON.parse(chunks);
                response.json({messagesNum: messages.length});
            });
        }).on('error', function(e) {
            console.log("Got error: ", e);
        });
    });

router.route('/filter/*')
    .get(function(req, response) {
        console.log('Handling filter request...');
        var url = restURL+'/messages'+req.url;
        http.get(url, function(res) {
            var chunks = '';

            res.on('data', function(chunk) {
                chunks += chunk;
            });

            res.on('end', function() {
                messages = JSON.parse(chunks);
                response.json({messagesNum: messages.length});
            });
        }).on('error', function(e) {
            console.log("Got error: ", e);
        });
    });

router.route('/cluster/hierarchical')
    .get(function(req, res) {
        console.log('Handling cluster request...');
        var distance = ['euclidean', 'manhattan', 'max'][req.query.distance];
        var linkage = ['single', 'complete', 'average'][req.query.linkage];
        var threshold = req.query.threshold;

        var metric = function(msg1, msg2) {
            return geolib.getDistance(msg1.location, msg2.location);
        }

        var leaves = function (hcluster) {
            // flatten cluster hierarchy
            if (!hcluster.left)
                return [hcluster];
            else
                return leaves(hcluster.left).concat(leaves(hcluster.right));
        }

        clusters = clusterfck.hcluster(messages, metric, linkage, threshold);

        var flat_clusters = clusters.map(function (hcluster) {
            return leaves(hcluster).map(function (leaf) {
                return leaf.value;
            });
        });

        clusters = flat_clusters;

        clusters.forEach(function (cluster) {
            poly = terraformer.Polygon({
                paths: cluster.map(function (item) {
                    return new google.maps.LatLng(item.lat, item.lon);
                }),
                strokeColor: '#000',
                strokeOpacity: 0.2,
                strokeWeight: 2,
                fillColor: '#000',
                fillOpacity: 0.1
            });


            cluster.forEach(function (message) {
                /*var marker = new google.maps.Marker({
                 position: new google.maps.LatLng(message.location.latitude, message.location.longitude),
                 map: map.getMapInstance()
                 });*/
                convexHull.addPoint(message.location.longitude, message.location.latitude);
            });


            if (convexHull.points.length > 0) {
                var hullPoints = convexHull.getHull();


                console.log(clusters.length);
        res.json(clusters);
    });


// Register routers
app.use('/', router);

// Register client side web app
app.use(express.static(webAppPath));

// Start the server
app.listen(port);
console.log('Node.js server started on port ' + port);
