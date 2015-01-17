var HCluster =
    {
        clusterMessages: function(messages, distance, linkage, threshold) {

            var self = this;

            var metric = function(msg1, msg2) {
                function locToLatLng(loc) {
                    return new google.maps.LatLng(loc.latitude, loc.longitude);
                }
                return google.maps.geometry.spherical.computeDistanceBetween(locToLatLng(msg1.location), locToLatLng(msg2.location));
            }
            var clusterfckLinkage = [clusterfck.SINGLE_LINKAGE, clusterfck.COMPLETE_LINKAGE,clusterfck.AVERAGE_LINKAGE][linkage];

            var clusters = clusterfck.hcluster(filteredMessages, metric, clusterfckLinkage, threshold);

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