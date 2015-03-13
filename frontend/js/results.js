var ResultsPage = {
    map: null,
    init: function() {
        var map = new Map($('#resultsMap')[0]);
        this.map = map;
        map.init(40.821715, -74.122381);               //TODO optimize zoom and location to display results
        $.getJSON('convexhulls', function(data) {
            GETIOM.convexHulls = data;
            ResultsPage.loadPolygons(map);
        });

        // Draw Charts
        var filterData = [
            {label: "", data: GETIOM.filteredMessagesNum},
            {label: "", data: GETIOM.databaseMessagesNum-GETIOM.filteredMessagesNum}
        ]
        var clusterData = GETIOM.clusterSizeArray.map(function(clusterSize) {
            return {label:"", data: clusterSize};
        });
        var computationTime = [
            {label: "Filtering:" + GETIOM.filteringTime + ' sec', data: GETIOM.filteringTime},
            {label: "Clustering:" + GETIOM.clusteringTime + ' sec', data: GETIOM.clusteringTime}
        ]
        $.plot('#resultsFilterChart', filterData, {
            series: {
                pie: {
                    show: true
                },
                legend: {
                    show: false
                }

            }
        });
        $.plot('#resultsClusterChart', clusterData, {
            series: {
                pie: {
                    show: true
                },
                legend: {
                    show: false
                }
            }
        });
        $.plot('#resultsComputationChart', computationTime, {
            series: {
                pie: {
                    innerRadius: 0.9,
                    show: true
                },
                legend: {
                    show: false
                }
            }
        });
    },
    loadPolygons: function (map) {
        for (var i=0; i < GETIOM.convexHulls.length; ++i) {
            var hull = GETIOM.convexHulls[i];
            var hullPoints = hull.map(function (point) {
                return new google.maps.LatLng(point[0], point[1]);
            });
            map.addClusterPolygon(hullPoints, GETIOM.clusterSizeArray[i]);
        }
    }
};


function runSD(){
    var map = ResultsPage.map;
    var clusterIndex = map.getSelectedClusterIndex();
    var sdFactor = parseFloat($('input[name="sd"]').val());
    if (clusterIndex > -1) {
        $.getJSON('trends/standard_deviation/'+clusterIndex+'?factor='+sdFactor, function( data ) {
            if (data.length == 0) {
                modalMessage('No trends found!');
            }
            else {
                var result = 'Found trend on';
                for (var i=0; i<data.length; ++i) {
                    result = result + ' ' + data[i].day;
                }
                modalMessage(result);
            }
        });
    }
    else {
        modalMessage('No cluster selected')
    }
}

function runLR(){

}

function runRA() {

}

$(document).ready(function() {
    var trendForm = new SelectiveForm(['standard deviation', 'linear regression', 'running average'], ['sd_panel', 'lr_panel', 'ra_panel'], 'trend_algo_select', [runSD, runLR, runRA]);
    trendForm.init();
    $('#submitTrend').click(function() {
        trendForm.submit();
    })
});