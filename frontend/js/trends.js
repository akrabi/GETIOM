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

var TrendsPage = {
    map: null,
    trendForm: null,
    init: function() {
        if (!TrendsPage.trendForm) {
            var trendAlgorithms = GETIOM.trendAlgorithms;
            var panels = [];
            var ids = [];
            var calls = [];
            for (var algorithm in trendAlgorithms) {
                ids.push(algorithm);
                panels.push(algorithm + '_panel');
                calls.push(function () {
                    runTrendDetection(algorithm)
                });
            }
            //TrendsPage.trendForm = SelectiveForm(ids, panels, 'trend_algo_select', calls); // TODO new?
            //TrendsPage.trendForm.init();
            TrendsPage.trendForm = AlgorithmsForm(trendAlgorithms, 'trend_algo_select', 'trend_param_panel', runTrendDetection);
            TrendsPage.trendForm.init();
        }
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
    $('#submitTrend').click(function() {
        var t1 = Date.now();
        TrendsPage.trendForm.submit();
        GETIOM.trendDetectionTime = (Date.now() - t1) / 1000;
    })
});