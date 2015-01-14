var Map = function (domNode) {

    var domNode = domNode;
    var drawingManager = null;
    var searchBox = null;
    var map = null;
    var shapes = [];
    var markers = [];

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
        while (shapes.length > 0) {
            var shape = shapes.pop();
            shape.overlay.setMap(null);
        }
    }

    return {

        init: function () {
            var mapOptions = {
                center: new google.maps.LatLng(37.774546, -122.433523),
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                zoom: 13
            };

            map = new google.maps.Map(domNode, mapOptions);
            drawingManager && drawingManager.setMap(map);
        },

        addDrawingManager: function(rectangleControl, circleControl, polygonControl, deleteControl) {
            // Initialize the drawing manager
            drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: !rectangleControl && !circleControl && !polygonControl && !deleteControl,
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
                rectangleOptions: {
                    type: 'rectangle',
                    fillColor: '#2D5DCA',
                    fillOpacity: 0.25,
                    strokeWeight: 3,
                    clickable: true,
                    editable: true,
                    draggable: true,
                    zIndex: 1
                },
                circleOptions: {
                    type: 'circle',
                    fillColor: '#ffff00',
                    fillOpacity: 0.25,
                    strokeWeight: 3,
                    clickable: true,
                    editable: true,
                    draggable: true,
                    zIndex: 1
                },
                polygonOptions: {
                    type: 'polygon',
                    fillColor: '#008000',
                    fillOpacity: 0.25,
                    strokeWeight: 3,
                    clickable: true,
                    editable: true,
                    draggable: true,
                    geodesic: true,
                    zIndex: 1
                }
            });

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function (shape) {
                shapes.push(shape);
                drawingManager.setDrawingMode(null);
            });

            if(!drawingManager.drawingControl) {
                rectangleControl.click(drawRectangle);
                circleControl.click(drawCircle);
                polygonControl.click(drawPolygon);
                deleteControl.click(deleteAllShapes);
            }
            drawingManager.setMap(map);
        },

        addSearchBox: function() {
            if (searchBox) return;

            // Create search box UI element
            $('<input class="controls mapSearchBox" type="text" placeholder="Search Box">').insertBefore(domNode);
            var input = $('input.controls.mapSearchBox');
            input.keydown(function(event){
                if(event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                }
            });

            var inputNode = input[0];

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputNode);

            searchBox = new google.maps.places.SearchBox(
                /** @type {HTMLInputElement} */(inputNode));

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
        },

        show: function () {
            domNode.style.display = 'block';
        },

        hide: function () {
            domNode.style.display = 'none';
        },

        getShape: function() {
            return shapes && shapes.length && shapes[0];
        }

    }
};
