var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
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
    next();
});


router.route('/filter/location/circle')
    .get(function(req, res) {
        res.json({message: 'got ' + messages.length + ' filtered messages from server...'});
    });


router.route('/cluster')


    // cluster all messages, return number of clusters
    .get(function(req, res) {
        //var leaves = function(cluster) {
        //    // flatten cluster hierarchy
        //    if(!cluster.left)
        //        return [cluster.value];
        //    else
        //        return leaves(cluster.left).concat(leaves(cluster.right));
        //}
        var timeMetric = function (msg1, msg2) {
            return Math.abs(msg1.time1 - msg2.time1); // return time difference (in milliseconds)
        }
        var threshold = 1800000; // 3hrs in milliseconds
        var clusters = clusterfck.hcluster(messages, timeMetric, clusterfck.AVERAGE_LINKAGE, threshold); //TODO save clusters somewhere

        res.json(clusters);
    });

router.route('/aggregate')

    // cluster all messages, return number of clusters
    .get(function(req, res) {
        //TODO return information about the clusters.

    });


// Register routers
app.use('/messages', router);

// Register client side web app
app.use(express.static(webAppPath));

// Start the server
app.listen(port);
console.log('Node.js server started on port ' + port);