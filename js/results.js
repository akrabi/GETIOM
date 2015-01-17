$(document).ready(function () {
    var map = new Map($('#resultsMap')[0]);
    map.init(40.71660077, -73.95056784); //TODO optimize zoom and location to display results
    map.hide();
    $('#resultsShowMap').click(function() {
        map.show();
    });
});


