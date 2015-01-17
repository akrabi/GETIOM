var HCluster =
    {
        clusterMessages: function(messages, linkage) {
            /*var worker = new Worker("js/modules/HClusterWorker.js");

            var self = this;
            worker.onmessage = function (event) {
                var clusters = event.data.clusters.map(function (hcluster) {
                    return self.leaves(hcluster).map(function (leaf) {
                        return leaf.value;
                    });
                });

                alert('got : ' + clusters.length + ' clusters.')
            };

            worker.onerror = function (event) {
                console.log("Worker thread error: " + event.message
                + " " + event.filename + " " + event.lineno);
            };*/

            var self = this;

            var metric = function(msg1, msg2) {
                function locToLatLng(loc) {
                    return new google.maps.LatLng(loc.latitude, loc.longitude);
                }
                return google.maps.geometry.spherical.computeDistanceBetween(locToLatLng(msg1.location), locToLatLng(msg2.location));
            }
            var options = {
                "single" : {link: 'single', thresh: 7},
                "complete": {link: 'complete', thresh: 125},
                "average": {link: 'average', thresh: 60}
            }[linkage];

            /*worker.postMessage({
                messages: 'da',
                metric: metric,
                linkage: linkage
            });*/
            var clusters = clusterfck.hcluster(filteredMessages, metric, /*options.link*/clusterfck.AVERAGE_LINKAGE, /*options.thresh*/2500);

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