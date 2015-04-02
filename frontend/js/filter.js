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
            modalMessage('GETIOM Started.<br>Server DB contains ' + GETIOM.databaseMessagesNum + ' messages!');
        })
            .error(function() {
                modalMessage('Error!<br> Failed to start GETIOM.<br>Check that the server is up and running');
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

        $('#filterLocationForm').submit(function (e) {
            e.preventDefault();

            var shape = map.getShape();
            var url = null;

            $('#processingModal').modal();
            GETIOM.filteringTime = Date.now();

            if (shape.type === 'circle') {
                var circle = shape.overlay;
                var lat = circle.getCenter().lat();
                var lng = circle.getCenter().lng();
                var radius = circle.getRadius();
                url = 'filter/location/circle?lat=' + lat + '&lng=' + lng + '&radius=' + radius;
            }
            else if (shape.type === 'rectangle') {
                var rect = shape.overlay;
                var bounds = rect.getBounds();
                var lat1 = bounds.getNorthEast().lat();
                var lng1 = bounds.getNorthEast().lng();
                var lat2 = bounds.getSouthWest().lat();
                var lng2 = bounds.getSouthWest().lng();
                url = 'filter/location/rectangle?lat1=' + lat1 + '&lng1=' + lng1 + '&lat2=' + lat2 + '&lng2=' + lng2;
            }
            else if (shape.type === 'polygon') {
                var i = 0;
                var points = '[';
                var poly = shape.overlay;

                //iterate over the paths
                poly.getPaths().getArray().forEach(function(path){

                    //iterate over the points in the path
                    path.getArray().forEach(function(latLng){
                        i++;
                        if (i > 1) {
                            points += ',';
                        }
                        points += '[\"'+latLng.lat()+'\",\"'+latLng.lng()+'\"]';
                    });
                });
                points  += ']';
                url = 'filter/location/polygon?points=' + points;
            }
            else {
                GETIOM.filteringTime = Date.now();
                url = 'filter';
            }
            $.getJSON(url, function (data) {
                GETIOM.filteredMessagesNum = data.messagesNum;
                filteringDone();
            })
                .error(function() {
                    $('#processingModal').modal('hide');
                    modalMessage('Error!<br> Failed to filter.<br>Check that the server is up and running');
                });
        });
    }
};

function filteringDone() {
    $('#processingModal').modal('hide');
    var t2 = Date.now();
    var ms = t2 - GETIOM.filteringTime;     //time in milliseconds
    GETIOM.filteringTime = ms / 1000;
    modalMessage('Filtered ' + GETIOM.filteredMessagesNum + ' messages in ' + GETIOM.filteringTime + ' seconds!');
    moveTo('cluster');
}