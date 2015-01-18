$(document).ready(function () {
    var map = new Map($('#resultsMap')[0]);
    map.init(40.71660077, -73.95056784);                //TODO optimize zoom and location to display results
    map.hide();
    $('#resultsShowMap').click(function () {
        loadPolygons(map);
        map.show();
    });
});

//clusters

function loadPolygons(map) {
    var clusters = GETIOM.clusters;
    var convexHull = new ConvexHullGrahamScan();
    var poly;
    var polyHull;
    var i=0;
    clusters.forEach(function (cluster) {
        poly = new google.maps.Polygon({
         paths: cluster.map(function (item) {
         return new google.maps.LatLng(item.lat, item.lon);
         }),
         strokeColor: '#000',
         strokeOpacity: 0.2,
         strokeWeight: 2,
         fillColor: '#000',
         fillOpacity: 0.1
         });


        cluster.forEach(function (message) {
            /*var marker = new google.maps.Marker({
             position: new google.maps.LatLng(message.location.latitude, message.location.longitude),
             map: map.getMapInstance()
             });*/
            convexHull.addPoint(message.location.longitude, message.location.latitude);
        });


        if (convexHull.points.length > 0) {
            var hullPoints = convexHull.getHull();


            //Convert to google latlng objects
            hullPoints = hullPoints.map(function (point) {
                return new google.maps.LatLng(point.y, point.x);
            });

            console.log(hullPoints);

            polyHull = new google.maps.Polygon({
                paths: hullPoints,
                strokeColor: '#000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#000',
                fillOpacity: 0.35
            });

            polyHull.setMap(map.getMapInstance());
        }
    });
}

