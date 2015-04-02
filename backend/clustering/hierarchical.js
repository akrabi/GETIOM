var Hierarchical = function() {
    var geolib = require('geolib');
    var clusterfck = require('clusterfck');
    return {
        cluster: function(data, params) {
            var distance = ['euclidean', 'manhattan', 'max'][params.distance]; //TODO remove from here and UI (not used)
            var linkage = ['single', 'complete', 'average'][params.linkage];
            var threshold = params.threshold;

            var metric = function(msg1, msg2) {
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

            var clusters = clusterfck.hcluster(data, metric, linkage, threshold);

            var flat_clusters = clusters.map(function (hcluster) { //TODO do it without recursion
                return leaves(hcluster).map(function (leaf) {
                    return leaf.value;
                });
            });

            return flat_clusters;
        }
    }
}();


module.exports = Hierarchical;
