var http       = require('http');
var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var terraformer= require('terraformer');
var trends     = require('./trends/trends.js');


// Configuration parameters
var restURL = "http://localhost:8081/messages"
var port = process.env.PORT || 8080;    // Server's port
var webAppPath = "../frontend";         // Path to client web application

// Declare global app variables
var messages = require("../RestExamples/NodeRestService/models/1KMessages.json");
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

router.route('/cluster/hierarchical')
    .get(function(req, res) {
        if (!messages) {
            console.log('Cannot cluster when no messages are loaded!');
            res.json([]);
        }
        console.log('Handling cluster request...');
        var distance = ['euclidean', 'manhattan', 'max'][req.query.distance];
        var linkage = ['single', 'complete', 'average'][req.query.linkage];
        var threshold = req.query.threshold;

        var metric = function(msg1, msg2) {
            //return geolib.getDistance(msg1.location, msg2.location);
            var loc1 = {latitude: msg1.geometry.coordinates[0], longitude: msg1.geometry.coordinates[1]};
            var loc2 = {latitude: msg2.geometry.coordinates[0], longitude: msg2.geometry.coordinates[1]};
            return geolib.getDistance(loc1, loc2);
        }

        var leaves = function (hcluster) {
            // flatten cluster hierarchy
            if (!hcluster.left)
                return [hcluster];
            else
                return leaves(hcluster.left).concat(leaves(hcluster.right));
        }

        clusters = clusterfck.hcluster(messages, metric, linkage, threshold);

        var flat_clusters = clusters.map(function (hcluster) { //TODO do it without recursion
            return leaves(hcluster).map(function (leaf) {
                return leaf.value;
            });
        });

        clusters = flat_clusters;

        res.json(clusters.map(function(cluster) {return cluster.length}));
    });

router.route('/cluster/kmeans')
    .get(function(req, res) {
        console.log('Initiating kmeans clustering...');
        var k = req.query.k;
        var metric = function(msg1, msg2) {
            var loc1 = {latitude: msg1.geometry.coordinates[0], longitude: msg1.geometry.coordinates[1]};
            var loc2 = {latitude: msg2.geometry.coordinates[0], longitude: msg2.geometry.coordinates[1]};
            return geolib.getDistance(loc1, loc2);
        }
        clusters = clusterfck.kmeans(messages, k, metric);
        res.json(clusters.map(function(cluster) {return cluster.length}));
    });

router.route('/cluster/dbscan')
    .get(function(req, res) {
        if (!messages) {
            console.log('Cannot cluster when no messages are loaded!');
            res.json([]);
        }
        console.log('Handling cluster request...');
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

router.route('/cluster/grid')
    .get(function(req, res) {
        if (!messages) {
            console.log('Cannot cluster when no messages are loaded!');
            res.json([]);
        }
        console.log('Handling Grid cluster request...');
        console.log('OMER - GOT HERE.');
        //var mcOptions = {gridSize: 50, maxZoom: 15};
        ////var markers = []; // Create the markers you want to add and collect them into a array.
        //var markers = GETIOM.data; // Create the markers you want to add and collect them into a array.
        //var mc = new MarkerClusterer(map, markers, mcOptions);

        if (!messages) {
            console.log('Cannot cluster when no messages are loaded!');
            res.json([]);
        }
        console.log('Handling Grid cluster request...');
        var markers_data = [];
        if (messages.length > 0) {
            for (var i = 0; i < messages.length; i++) {
                markers_data.push({
                    lat: messages[i].geometry.coordinates[0],
                    lng: messages[i].geometry.coordinates[1]
                });
            }
        }
        map.addMarkers(markers_data);

        markerClusterer: function(map) {
            options = {
                gridSize: 40
            }

            //return new MarkerClusterer(map, [], options);
        }
        clusters = clusterfck.kmeans(messages, k, metric);
        res.json(clusters.map(function(cluster) {return cluster.length}));
    });





router.route('/trends/:trend/:cluster')
    .get(function(req, res) {
        var cluster = clusters[req.params.cluster];
        res.json(trends[req.params.trend].findTrends(cluster, req.query));
    });

// Register routers
app.use('/', router);

// Register client side web app
app.use(express.static(webAppPath));

// Start the server
app.listen(port);
console.log('Node.js server started on port ' + port);
