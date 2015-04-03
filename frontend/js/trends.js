//function runGA(){
//    var map = TrendsPage.map;
//    var clusterIndex = map.getSelectedClusterIndex();
//    var sdFactor = parseFloat($('input[name="sd"]').val());
//    if (clusterIndex > -1) {
//        $.getJSON('trends/global_average/'+clusterIndex+'?factor='+sdFactor, function( data ) {
//            var trends = data && data.trends;
//            if (!trends || trends.length == 0) {
//                modalMessage('No trends found!');
//            }
//            else {
//                var avg = data.additional.avg;
//                var sd = data.additional.sd;
//                var days = data.additional.days;
//                var result =    'Messages: ' + data.additional.messagesNum + '<br>' +
//                    'Days: ' + days.length + '<br>' +
//                    'Trends: ' + trends.length;
//
//                modalMessage(result);
//
//                var averagePoints = days.map(function(day) {
//                    return [day[0], avg];
//                });
//                var topSDPoints = days.map(function(day) {
//                    return [day[0], avg + sd * sdFactor];
//                });
//                var bottomSDPoints = days.map(function(day) {
//                    return [day[0], avg - sd * sdFactor];
//                });
//
//
//                moveTo('results');
//                $.plot("#trend_results", [
//                        {
//                            data: days,
//                            lines:   {
//                                show: true
//                            },
//                            points: {
//                                show: true,
//                                radius: 4
//                            }
//                        },
//                        {	data: trends,
//                            points: {
//                                show: true,
//                                radius: 5
//                            },
//                            color: "#ff0000"
//                        },
//                        {
//                            data: topSDPoints,
//                            label: "Average + Factor*SD",
//                            dashes: { show: true }
//                        },
//                        {
//                            data: averagePoints,
//                            label: "Average",
//                            lines: { show: true }
//                        },
//                        {
//                            data: bottomSDPoints,
//                            label: "Average - Factor*SD",
//                            dashes: { show: true }
//                        }],
//                    {
//                        xaxis:
//                        {
//                            mode: "time",
//                            timeformat: "%d/%m/%Y"
//                        },
//                        grid:
//                        {
//                            backgroundColor: "#f8f8f8",
//                            hoverable: true
//                        }
//                    }
//                );
//            }
//        });
//    }
//    else {
//        modalMessage('No cluster selected');
//    }
//}
function runTrendDetection(algorithmId){
    var algorithm = GETIOM.trendAlgorithms[algorithmId];

    var map = TrendsPage.map;
    var clusterIndex = map.getSelectedClusterIndex();
    var params = '';
    var count = 0;

    for (var param in algorithm.params) {
        if (count > 0) {
            params += '&';
        }
        params += param + '=' + $('input[name="'+algorithmId+'_' + param +'"]').val();
    }
    if (clusterIndex > -1) {
        $.getJSON('trends/'+algorithmId+'/'+clusterIndex+'?'+params, function( data ) {
            var plotDataArray = $.extend(true, [], algorithm.plotData); // Cloning needed because we're changing it.
            var plotOptions = algorithm.plotOptions;
            if (!data || data.trendsNum === 0) {
                modalMessage('No trends found!');
            }
            else {
                var result =
                    'Messages: ' + data.messagesNum + '<br>' +
                    'Days: ' + data.daysNum + '<br>' +
                    'Trends: ' + data.trendsNum;

                modalMessage(result);

                moveTo('results');

                plotDataArray.forEach(function(plotData) {
                    plotData.data = data[plotData.data];
                });

                $.plot("#trend_results", plotDataArray, plotOptions);
            }
        });
    }
    else {
        modalMessage('No cluster selected');
    }
}

function runGA() {
    runTrendDetection('global_average');
}

function runLR(){
    runTrendDetection('linear_regression');
}

function runRA() {
     runTrendDetection('running_average');
}

var TrendsPage = {
    map: null,
    init: function() {
        var map = new Map($('#resultsMap')[0]);
        this.map = map;
        map.init(40.821715, -74.122381);               //TODO optimize zoom and location to display results
        TrendsPage.loadPolygons(map);   //TODO use self instead of TrendsPage
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
    var trendForm = new SelectiveForm(['global average', 'linear regression', 'running average'], ['ga_panel', 'lr_panel', 'ra_panel'], 'trend_algo_select', [runGA, runLR, runRA]);
    trendForm.init();
    $('#submitTrend').click(function() {
        var t1 = Date.now();
        trendForm.submit();
        GETIOM.trendDetectionTime = (Date.now() - t1) / 1000;
    })
});