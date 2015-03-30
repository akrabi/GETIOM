var http       = require('http');
var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var terraformer= require('terraformer');
var trends     = require('./trends/trends.js');
var clustering = require('./clustering/clustering.js');


// Configuration parameters
var restURL = "http://localhost:8081/messages"
var port = process.env.PORT || 8080;    // Server's port
var webAppPath = "../frontend";         // Path to client web application

// Declare global app variables
var messages = null;
var clusters = null;
var convexHulls = null;

// configure app
var app = express();
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//TODO consider usage of GeoStore
//var GeoStore = require('terraformer-geostore').GeoStore;
//var RTree = require('terraformer-rtree').RTree;
//var Memory = require('terraformer-geostore-memory').Memory;
//var store = new GeoStore({
//    store: new Memory(),
//    index: new RTree()
//});
//
//store.add(messages, function(err, res){
//    err && console.log('Error!!! ' + err);
//    res && console.log('Success!!');
//});

//TODO check turf!
//var turf = require('turf');
//var extent = turf.extent({type: 'FeatureCollection', features: messages});
//extent = extent.map(function(coord) {
//    return parseFloat(coord);
//});
////var extent = [-77.3876953125,38.71980474264239,-76.9482421875,39.027718840211605];
//console.log(extent);
//var cellWidth = 100;
//var units = 'miles';
//
//var squareGrid = turf.squareGrid(extent, cellWidth, units);
//console.log(squareGrid);


//(messages, function(err, features) {
//    if (err) throw err;
//    turf.extent(features, function(extent) {
//        console.log(extent);
//    });
//});



// function to recieve filtered messages from REST API
function getData(url, callback) {
    console.log('Getting data from: ' + url);
    http.get(url, function(res) {
        var chunks = '';

        res.on('data', function(chunk) {
            chunks += chunk;
        });

        res.on('end', function() {
            callback(JSON.parse(chunks));
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
        var url = restURL+'/num';
        getData(url, function(messagesNum) {
            response.json(messagesNum);
        });
    });

router.route('/filter')
    .get(function(req, response) {
        console.log('Handling filter request...');
        var url = restURL;
        getData(url, function(data) {
            messages = data;
            response.json({messagesNum: messages.length});
        });
    });

router.route('/filter/*')
    .get(function(req, response) {
        console.log('Handling filter request...');
        var url = restURL+req.url;
        getData(url, function(data) {
            messages = data;
            response.json({messagesNum: messages.length});
        });
    });

router.route('/convexhulls')
    .get(function(req, res) {
        if (!clusters) {
            console.log('No clusters to display...');
            res.json([]);
        }
        convexHulls = clusters.map(function(cluster) {
            return terraformer.Tools.convexHull(cluster.map(function (geoPoint) {
                //return terraformer.Tools.toGeographic(geoPoint);
                return geoPoint.geometry.coordinates;
            }));
        });
        res.json(convexHulls);
    });

router.route('/cluster/:clusterAlgo')
    .get(function(req, res) {
        console.log('Handling ' + req.params.clusterAlgo + ' clustering request...');
        if (!messages) {
            console.log('Cannot cluster when no messages are loaded!');
            res.json([]);
        }
        var clusterAlgo = clustering[req.params.clusterAlgo];
        clusters = clusterAlgo.cluster(messages, req.query);
        res.json(clusters.map(function(cluster) {return cluster.length}));
    });

router.route('/trends/:trendAlgo/:clusterIndex')
    .get(function(req, res) {
        if (!clusters || clusters.length == 0) {
            console.log('Cannot find trends when there are no clusters!');
            res.json([]);
        }
        var cluster = clusters[req.params.clusterIndex];
        var trendAlgo = trends[req.params.trendAlgo];
        res.json(trendAlgo.findTrends(cluster, req.query));
    });

// Register routers
app.use('/', router);

// Register client side web app
app.use(express.static(webAppPath));

// Start the server
app.listen(port);
console.log('Node.js server started on port ' + port);
