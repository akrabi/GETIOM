$(document).ready(function () {
    // Initialize slider
    var slider = new TimeSlider($('#filterTimeSlider')[0]);
    slider.init()
    var map = new Map($('#filterLocationMap')[0]);
    map.init();
    map.addSearchBox();
    map.addDrawingManager();

    $('#filterForm').submit(function(e) {
        e.preventDefault();
        var shape = map.getShape();
        if (shape.type === 'circle') {
            var circle = shape.overlay;
            var x = circle.getCenter().lat();
            var y = circle.getCenter().lng();
            var r = circle.getRadius();
            $.getJSON('rest/messages/filter/location/circle?x='+x+'&y='+y+'&r='+r, function( data ) {
                filteredMessages = data;
                moveTo('cluster');
            });
        }
        else if (shape.type === 'rectangle') {
            var rectangle = shape.overlay;
            var x = circle.getCenter().lat();
            var y = circle.getCenter().lng();
            var r = circle.getRadius();
            $.getJSON('rest/messages/filter/location/circle?x='+x+'&y='+y+'&r='+r, function( data ) {
                filteredMessages = data;
                moveTo('cluster');
            });
        }
    });

});
