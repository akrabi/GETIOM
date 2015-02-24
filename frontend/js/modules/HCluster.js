var HCluster =
    {
        clusterMessages: function(messages, distance, linkage, threshold) {
            var clusterfck = require('clusterfck');
            var geolib     = require('geolib');
            var self = this;

            var metric = function(msg1, msg2) {
                return geolib.getDistance(msg1.location, msg2.location);
            }
            var clusterfckLinkage = [clusterfck.SINGLE_LINKAGE, clusterfck.COMPLETE_LINKAGE,clusterfck.AVERAGE_LINKAGE][linkage];

            var clusters = clusterfck.hcluster(messages, metric, clusterfckLinkage, threshold);

            var flat_clusters = clusters.map(function (hcluster) {
                return self.leaves(hcluster).map(function (leaf) {
                    return leaf.canonical;
                });
            });
            return flat_clusters;
        },

        leaves: function (hcluster) {
            // flatten cluster hierarchy
            if (!hcluster.left)
                return [hcluster];
            else
                return this.leaves(hcluster.left).concat(this.leaves(hcluster.right));
        }
    };