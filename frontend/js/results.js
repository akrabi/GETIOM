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
            var trends = data && data.trends;
            if (!trends || trends.length == 0) {
                modalMessage('No trends found!');
            }
            else {
                var avg = data.additional.avg;
                var sd = data.additional.sd;
                var result = 'Found trend on';

                var f = function(x) { return m*x+b };

                var linePoints = [];
                var topSDPoints = [];
                var bottomSDPoints = [];

                for (var i=0; i<trends.length; ++i) {
                    var day = trends[i][0];
                    result = result + ' ' + day;
                    linePoints.push([day, avg]); //TODO handle single point
                    topSDPoints.push([day, avg+sd*sdFactor]);
                    bottomSDPoints.push([day, avg-sd*sdFactor]);
                }

                modalMessage(result);

                $.plot("#trend_results", [
                        {	data: trends,
                            points: { show: true }
                        },
                        {
                            data: topSDPoints,
                            lines: { show: true }
                        },
                        {
                            data: linePoints,
                            lines: { show: true }
                        },
                        {
                            data: bottomSDPoints,
                            lines: { show: true }
                        }],
                        {
                            xaxis:
                            {
                                mode: "time",
                                timeformat: "%Y/%m/%d"
                            }
                        }
                );
            }
        });
    }
    else {
        modalMessage('No cluster selected');
    }
}

function runLR(){
    var map = ResultsPage.map;
    var clusterIndex = map.getSelectedClusterIndex();
    var threshold = parseFloat($('input[name="lr"]').val());
    if (clusterIndex > -1) {
        $.getJSON('trends/linear_regression/'+clusterIndex+'?threshold='+threshold, function( data ) {
            var trends = data.trends;
            if (trends.length == 0) {
                modalMessage('No trends found!');
            }
            else {
                var line = data.additional.line;
                var f = function(x) { return m*x+b };

                var linePoints = [];

                for (var i=0; i<trends.length; ++i) {
                    var day = trends[i][0];
                    linePoints.push([day, f(day)]);
                }

                $.plot("#trend_results", [
                        {	data: trends,
                            points: { show: true }
                        },
                        {
                            data: linePoints,
                            lines: { show: true }
                        }],
                        {
                            xaxis:
                            {
                                mode: "time",
                                timeformat: "%Y/%m/%d"
                            }
                        }
                );
            }
        });
    }
    else {
        modalMessage('No cluster selected')
    }
}

function runRA() {
    var map = ResultsPage.map;
    var clusterIndex = map.getSelectedClusterIndex();
    var threshold = parseFloat($('input[name="ra"]').val());
    if (clusterIndex > -1) {
        $.getJSON('trends/running_average/'+clusterIndex+'?threshold='+threshold, function( data ) {
            var trends = data.trends;
            var averages = data.additional.averages;
            if (trends.length == 0) {
                modalMessage('No trends found!');
            }
            else {
                $.plot("#trend_results", [
                        {	data: trends,
                            points: { show: true }
                        },
                        {
                            data: averages,
                            lines: { show: true }
                        }],
                        {
                            xaxis:
                            {
                                mode: "time",
                                timeformat: "%Y/%m/%d"
                            }
                        }
                );
            }
        });
    }
    else {
        modalMessage('No cluster selected')
    }
}

$(document).ready(function() {
    var trendForm = new SelectiveForm(['standard deviation', 'linear regression', 'running average'], ['sd_panel', 'lr_panel', 'ra_panel'], 'trend_algo_select', [runSD, runLR, runRA]);
    trendForm.init();
    $('#submitTrend').click(function() {
        trendForm.submit();
    })
});