var Map = function (domNode) {

    var domNode = domNode;
    var drawingManager = null;
    var searchBox = null;
    var map = null;
    var center = null;
    var shapes = [];
    var markers = [];
    var clusters = [];
    var selectedCluster = null;
    var normalClusterColor = '#000';
    var selectedClusterColor = '#FFF';

    function clearSelection() {
        if (selectedCluster) {
            selectedCluster.set('fillColor', normalClusterColor);
            selectedCluster.infoWindow.close();
        }
        selectedCluster = null;
    }

    function setSelectedCluster(cluster) {
        clearSelection();
        cluster.set('fillColor', selectedClusterColor);
        selectedCluster = cluster;
    }

    return {

        init: function (lat, lng) {
            center = new google.maps.LatLng(lat, lng);
            var mapOptions = {
                center: center,
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                zoom: 12
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
                drawingManager.setOptions({
                    drawingControl: false
                });
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

        addClusterPolygon: function(clusterHullPoints, clusterSize) {
            var polyHull = new google.maps.Polygon({
                paths: clusterHullPoints,
                strokeColor: normalClusterColor,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: normalClusterColor,
                fillOpacity: 0.35,
                clickable: true
            });

            clusters.push(polyHull);
            polyHull.setMap(map);
            polyHull.infoWindow = new google.maps.InfoWindow({
                content: '<div class="hullToolTip"><strong>Cluster size: '+clusterSize+'</strong></div>'
            });

            google.maps.event.addListener(polyHull, 'click', function(e) {
                setSelectedCluster(polyHull);
                var latLng = e.latLng;
                polyHull.infoWindow.setPosition(latLng);
                polyHull.infoWindow.open(map);
            });
        },

        deleteAllClusters: function() {
            clusters.forEach(function(cluster) {
                cluster.setMap(null);
            });
            clusters = [];
        },

        setSelectedClusterIndex: function(clusterIndex) {
            setSelectedCluster(clusters[clusterIndex]);
        },

        getSelectedClusterIndex: function() {
            for (var i=0; i<clusters.length; ++i) {
                if (selectedCluster === clusters[i]) {
                    return i;
                }
            }
            return -1;
        },

        show: function () {
            domNode.style.display = 'inline-block';
            google.maps.event.trigger(map, 'resize');
        },

        hide: function () {
            domNode.style.display = 'none';
        },

        getShape: function() {
            return shapes && shapes.length && shapes[0];
        },
        getMapInstance: function() {
            return map;
        },

        drawRectangle: function() {
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
        },
        drawCircle: function() {
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
        },
        drawPolygon: function() {
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        },

        deleteAllShapes: function() {
            if (!shapes || shapes.length < 1) return;
            while (shapes.length > 0) {
                var shape = shapes.pop();
                shape.overlay.setMap(null);
            }
            drawingManager.setOptions({
                drawingControl: true
            });
        }
    }
};
