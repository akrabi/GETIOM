function runSD(){
    var map = TrendsPage.map;
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
                var days = data.additional.days;
                var result =    'Messages: ' + data.additional.messagesNum + '<br>' +
                    'Days: ' + days.length + '<br>' +
                    'Trends: ' + trends.length;

                modalMessage(result);

                var averagePoints = days.map(function(day) {
                    return [day[0], avg];
                });
                var topSDPoints = days.map(function(day) {
                    return [day[0], avg + sd * sdFactor];
                });
                var bottomSDPoints = days.map(function(day) {
                    return [day[0], avg - sd * sdFactor];
                });


                moveTo('results');
                $.plot("#trend_results", [
                        {	data: trends,
                            points: {
                                        show: true,
                                        radius: 5
                                    },
                            color: "#ff0000"
                        },
                        {
                            data: topSDPoints,
                            lines: { show: true }
                        },
                        {
                            data: averagePoints,
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
                            timeformat: "%d/%m/%Y"
                        },
                        grid:
                        {
                            backgroundColor: "#f8f8f8",
                            hoverable: true
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
    var map = TrendsPage.map;
    var clusterIndex = map.getSelectedClusterIndex();
    var threshold = parseFloat($('input[name="lr"]').val());
    if (clusterIndex > -1) {
        $.getJSON('trends/linear_regression/'+clusterIndex+'?threshold='+threshold, function( data ) {
            var trends = data.trends;
            var days = data.additional.days;
            if (trends.length == 0) {
                modalMessage('No trends found!');
            }
            else {

                var result =    'Messages: ' + data.additional.messagesNum + '<br>' +
                    'Days: ' + days.length + '<br>' +
                    'Trends: ' + trends.length;

                modalMessage(result);
                var line = data.additional.line;
                //var f = function(x) { return m*x+b };
                //
                //var linePoints = [];
                //
                //for (var i=0; i<trends.length; ++i) {
                //    var day = trends[i][0];
                //    linePoints.push([day, f(day)]);
                //}

                $.plot("#trend_results", [
                        {	data: trends,
                            points:
                            {
                                show: true,
                                radius: 5
                            },
                            color: "#ff0000"
                        },
                        {
                            data: line,
                            lines: { show: true }
                        }],
                    {
                        xaxis:
                        {
                            mode: "time",
                            timeformat: "%d/%m/%Y"
                        },
                        grid:
                        {
                            backgroundColor: "#f8f8f8",
                            hoverable: true
                        }
                    }
                );
                moveTo('results');
            }
        });
    }
    else {
        modalMessage('No cluster selected')
    }
}

function runRA() {
    var map = TrendsPage.map;
    var clusterIndex = map.getSelectedClusterIndex();
    var threshold = parseFloat($('input[name="ra"]').val());
    if (clusterIndex > -1) {
        $.getJSON('trends/running_average/'+clusterIndex+'?threshold='+threshold, function( data ) {
            var trends = data.trends;
            var averages = data.additional.averages;
            var days = data.additional.days;
            if (trends.length == 0) {
                modalMessage('No trends found!');
            }
            else {
                var result =    'Messages: ' + data.additional.messagesNum + '<br>' +
                    'Days: ' + days.length + '<br>' +
                    'Days: ' + days.length + '<br>' +
                    'Trends: ' + trends.length;

                modalMessage(result);
                $.plot("#trend_results", [
                        {	data: trends,
                            points:
                            {
                                show: true,
                                radius: 5
                            },
                            color: "#ff0000"

                        },
                        {
                            data: averages,
                            lines: { show: true }
                        }],
                    {
                        xaxis:
                        {
                            mode: "time",
                            timeformat: "%d/%m/%Y"
                        },
                        grid:
                        {
                            backgroundColor: "#f8f8f8",
                            hoverable: true
                        }
                    }
                );
                moveTo('results');
            }
        });
    }
    else {
        modalMessage('No cluster selected')
    }
}

var TrendsPage = {
    map: null,
    init: function() {
        var map = new Map($('#resultsMap')[0]);
        this.map = map;
        map.init(40.821715, -74.122381);               //TODO optimize zoom and location to display results
        $.getJSON('convexhulls', function(data) {
            GETIOM.convexHulls = data;
            TrendsPage.loadPolygons(map);   //TODO use self instead of TrendsPage
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
}

$(document).ready(function() {
    var trendForm = new SelectiveForm(['standard deviation', 'linear regression', 'running average'], ['sd_panel', 'lr_panel', 'ra_panel'], 'trend_algo_select', [runSD, runLR, runRA]);
    trendForm.init();
    $('#submitTrend').click(function() {
        trendForm.submit();
    })
});