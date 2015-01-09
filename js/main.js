$( document ).ready(function() {
    // Initialize the map with the drawing controls
    var map = new Map($('#map-canvas')[0]);
    map.setDrawingManager($('#drawRectangle'), $('#drawCircle'), $('#drawPolygon'), $('#stopDrawing'), $('#deleteAllShapes'));
    map.init();

    // Initialize slider
    var slider = new TimeSlider($('#slider')[0]);
    slider.init();
});