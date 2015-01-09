function moveTo(step) {
    var filter = $('#filter');
    var cluster = $('#cluster');
    var results = $('#results');
    var filterStep = $('#filterStep');
    var clusterStep = $('#clusterStep');
    var resultsStep = $('#resultsStep');

    if (step === 'filter') {
        filter.show()
        cluster.hide();
        results.hide();
        filterStep.removeClass('complete , disabled').addClass('active');
        clusterStep.removeClass('complete , active').addClass('disabled');
        resultsStep.removeClass('complete , active').addClass('disabled');
    }
    else if (step === 'cluster') {
        filter.hide()
        cluster.show();
        results.hide();
        filterStep.removeClass('active , disabled').addClass('complete');
        clusterStep.removeClass('complete , disabled').addClass('active');
        resultsStep.removeClass('complete , active').addClass('disabled');
    }
    else if (step === 'results') {
        filter.hide()
        cluster.hide();
        results.show();
        filterStep.removeClass('active , disabled').addClass('complete');
        clusterStep.removeClass('active , disabled').addClass('complete');
        resultsStep.removeClass('complete , disabled').addClass('active');
    }
    $( window ).scrollTop( 0 );
}

$( document ).ready(function() {
    // Initialize the map with the drawing controls
    var map = new Map($('#map-canvas').get(0));
    //map.setDrawingManager($('#drawRectangle'), $('#drawCircle'), $('#drawPolygon'), $('#stopDrawing'), $('#deleteAllShapes'));
    map.init();
    map.hide();

    // Initialize slider
    var slider = new TimeSlider($('#time_slider')[0]);
    slider.init();
});

$('#filterForm').submit(function(e) {
    e.preventDefault();
    moveTo('cluster');
});
