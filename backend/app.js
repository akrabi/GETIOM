var http       = require('http');
var bl         = require('bl');
var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var geolib     = require('geolib');
var clusterfck = require('clusterfck');
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
        var distance = req.query.distance;
        var linkage = req.query.linkage;
        var threshold = req.query.threshold;
        console.log({distance: distance, linkage: linkage, threshold: threshold});
        clusters = clusterfck.hcluster(messages, distance, linkage, threshold);
        clusterfck.hcluster.SINGLE_LINKAGE
        console.log(clusters);
        res.json({clustersNum: clusters.length});
    });


// Register routers
app.use('/', router);

// Register client side web app
app.use(express.static(webAppPath));

// Start the server
app.listen(port);
console.log('Node.js server started on port ' + port);
