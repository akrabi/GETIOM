var FilterPage = {
    map: null,
    slider: null,
    init: function () {
        if (this.map) { // Already initialized
            this.map.deleteAllShapes();     //TODO remove this and add a button which allows shape deletion
            return;
        }

        // Get number of messages stored in server's DB
        $.getJSON('messages/num', function (data) {         //TODO get rid of messages!! change to dbsize
            GETIOM.databaseMessagesNum = data.messagesNum;
            var resultsModal = $('#resultsModal');
            resultsModal.find('.modal-body').html('GETIOM Started.<br>Server DB contains ' + GETIOM.databaseMessagesNum + ' messages!')
            resultsModal.modal();
        });

        // Initialize slider
        if (!this.slider) {
            this.slider = new TimeSlider($('#filterTimeSlider')[0]);
            this.slider.init()
        }


        // Initialize map
        var map = new Map($('#filterLocationMap')[0]);
        this.map = map;
        map.init(40.821715, -74.122381);
        map.addSearchBox();
        map.addDrawingManager();
        $('#filterLocationCollapse').click(function () {
            setTimeout(function () {
                map.show();
            }, 50);
        });

        $('#filterLocationForm').submit(function (e) {
            e.preventDefault();
            var shape = map.getShape();
            $('#processingModal').modal();
            if (shape.type === 'circle') {
                var circle = shape.overlay;
                var lat = circle.getCenter().lat();
                var lng = circle.getCenter().lng();
                var radius = circle.getRadius();
                GETIOM.filteringTime = Date.now();
                $.getJSON('filter/location/circle?lat=' + lat + '&lng=' + lng + '&radius=' + radius, function (data) {
                    GETIOM.filteredMessagesNum = data.messagesNum;
                    filteringDone();
                });
            }
            else if (shape.type === 'rectangle') {
                var rect = shape.overlay;
                var bounds = rect.getBounds();
                var lat1 = bounds.getNorthEast().lat();
                var lng1 = bounds.getNorthEast().lng();
                var lat2 = bounds.getSouthWest().lat();
                var lng2 = bounds.getSouthWest().lng();
                GETIOM.filteringTime = Date.now();
                $.getJSON('filter/location/rectangle?lat1=' + lat1 + '&lng1=' + lng1 + '&lat2=' + lat2 + '&lng2=' + lng2, function (data) {
                    GETIOM.filteredMessagesNum = data.messagesNum;
                    filteringDone();
                });
            }
            else {
                GETIOM.filteringTime = Date.now();
                $.getJSON('filter', function (data) {
                    GETIOM.filteredMessagesNum = data.messagesNum;
                    filteringDone();
                });
            }
        });
    }
};

function filteringDone() {
    $('#processingModal').modal('hide');
    var resultsModal = $('#resultsModal');
    var t2 = Date.now();
    var ms = t2 - GETIOM.filteringTime;     //time in milliseconds
    GETIOM.filteringTime = ms / 1000;
    resultsModal.find('.modal-body').html('Filtered ' + GETIOM.filteredMessagesNum + ' messages in ' + GETIOM.filteringTime + ' seconds!')
    resultsModal.modal();
    moveTo('cluster');
}