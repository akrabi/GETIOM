var filteredMessages;

$(document).ready(function () {
    // Initialize slider
    var slider = new TimeSlider($('#filterTimeSlider')[0]);
    slider.init()
    var map = new Map($('#filterLocationMap')[0]);
    map.init(40.71660077, -73.95056784);
    map.addSearchBox();
    map.addDrawingManager();
    $('#filterLocationCollapse').click(function() {
            setTimeout(function() {
                map.show();
            }, 50);
    });

    $('#filterLocationForm').submit(function(e) {
        e.preventDefault();
        var shape = map.getShape();
        if (shape.type === 'circle') {
            var circle = shape.overlay;
            var lat = circle.getCenter().lat();
            var lng = circle.getCenter().lng();
            var radius = circle.getRadius();
            $.getJSON('messages/filter/location/circle?lat='+lat+'&lng='+lng+'&radius='+radius, function( data ) {
                filteredMessages = data;
                moveTo('cluster');
            });
        }
        else if (shape.type === 'rectangle') {
            var rect = shape.overlay;
            var bounds = rect.getBounds();
            var lat1 = bounds.getNorthEast().lat();
            var lng1 = bounds.getNorthEast().lng();
            var lat2 = bounds.getSouthWest().lat();
            var lng2 = bounds.getSouthWest().lng();
            $.getJSON('messages/filter/location/rectangle?lat1='+lat1+'&lng1='+lng1+'&lat2='+lat2+'&lng2='+lng2, function( data ) {
                filteredMessages = data;
                moveTo('cluster');
            });
        }
        else {
            $.getJSON('messages', function( data ) {
                filteredMessages = data;
                moveTo('cluster');
            });
        }
    });

});
