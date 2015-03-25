var KMeans = function() {
    var geolib = require('geolib');
    var clusterfck = require('clusterfck');
    return {
        cluster: function(data, params) {
            var k = params.k;
            var metric = function(msg1, msg2) {
                var loc1 = {latitude: msg1.geometry.coordinates[0], longitude: msg1.geometry.coordinates[1]};
                var loc2 = {latitude: msg2.geometry.coordinates[0], longitude: msg2.geometry.coordinates[1]};
                return geolib.getDistance(loc1, loc2);
            }
            return clusterfck.kmeans(data, k, metric);
        }
    }
}();


module.exports = KMeans;
