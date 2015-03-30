/**
 * Created by omer on 3/17/15.
 */


//var markers = new L.MarkerClusterGroup();
//markers.addLayer(new L.Marker(getRandomLatLng(map)));
////... Add more layers ...
//    map.addLayer(markers);


var markers = [];
for (var i = 0; i < 100; i++) {
    var latLng = new google.maps.LatLng(data.photos[i].latitude,
        data.photos[i].longitude);
    var marker = new google.maps.Marker({'position': latLng});
    markers.push(marker);
}
var markerCluster = new MarkerClusterer(map, markers);