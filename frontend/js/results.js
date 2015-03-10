$(document).ready(function () {
    var map = new Map($('#resultsMap')[0]);
    map.init(40.821715, -74.122381);               //TODO optimize zoom and location to display results
    map.hide();

    $('#resultsShowMap').click(function () {
        $.getJSON('convexhulls', function( data ) {
            GETIOM.convexHulls = data;
            ResultsPage.loadPolygons(map);
            map.show();
        });
    });
});

var ResultsPage = {
    init: function() {
        // Draw Charts
        var filterData = [
            {label: "", data: GETIOM.filteredMessagesNum},
            {label: "", data: GETIOM.databaseMessagesNum-GETIOM.filteredMessagesNum}
        ]
        var clusterData = GETIOM.clusterSizeArray.map(function(clusterSize) {
            return {label:"", data: clusterSize};
        });
        var computationTime = [
            {label: "Filtering:" + GETIOM.filteringTime + ' sec', data: GETIOM.filteringTime},
            {label: "Clustering:" + GETIOM.clusteringTime + ' sec', data: GETIOM.clusteringTime}
        ]
        $.plot('#resultsFilterChart', filterData, {
            series: {
                pie: {
                    show: true
                },
                legend: {
                    show: false
                }

            }
        });
        $.plot('#resultsClusterChart', clusterData, {
            series: {
                pie: {
                    show: true
                },
                legend: {
                    show: false
                }
            }
        });
        $.plot('#resultsComputationChart', computationTime, {
            series: {
                pie: {
                    innerRadius: 0.9,
                    show: true
                },
                legend: {
                    show: false
                }
            }
        });
    },
    loadPolygons: function (map) {
        for (var i=0; i < GETIOM.convexHulls.length; ++i) {
            var hull = GETIOM.convexHulls[i];
            var hullPoints = hull.map(function (point) {
                return new google.maps.LatLng(point[0], point[1]);
            });

            console.log(hullPoints);

            var polyHull = new google.maps.Polygon({
                paths: hullPoints,
                strokeColor: '#000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#000',
                fillOpacity: 0.35
            });

            map.addShapeTooltip(polyHull, '<div class="hullToolTip"></div><strong>Cluster size: '+GETIOM.clusterSizeArray[i]+'</strong></div>');
            polyHull.setMap(map.getMapInstance());
        }
    }
};