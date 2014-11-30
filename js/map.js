var map = null;
var drawingManager = null;
var shapes = [];

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.774546, -122.433523),
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    zoom: 13
  };
  var markers = [];

  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */(input));

  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });


  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: false,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    markerOptions: {
      icon: 'images/beachflag.png'
    },
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 0.25,
      strokeWeight: 3,
      clickable: false,
      editable: true,
      zIndex: 1
    }
  });

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(shape) {
      shapes.push(shape);
  });

  drawingManager.setMap(map);
}


function drawRectangle() {
  drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
}
function drawCircle() {
  drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
}
function drawPolygon(){
  drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
}

function deleteAllShapes() {
  if (!shapes || shapes.length < 1) return;
  for (var i=0; i<shapes.length; ++i) {
    shapes[i].overlay.setMap(null);
  }
}

google.maps.event.addDomListener(window, 'load', initialize);