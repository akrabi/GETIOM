function runTrendDetection(algorithmIds){
    for (var i=0; i<algorithmIds.length; ++i){
        var algorithmId = algorithmIds[i];
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
            function getCallback(algorithmId, algorithm) {
                return function (data) {
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

                        if (GETIOM.currentStep !== 'results') {
                            moveTo('results');
                        }

                        plotDataArray.forEach(function (plotData) {
                            plotData.data = data[plotData.data];
                        });

                        $('#' + algorithmId + '_results').show();
                        $.plot('#' + algorithmId + '_results_graph', plotDataArray, plotOptions);
                    }
                }
            }
            $.getJSON('trends/'+algorithmId+'/'+clusterIndex+'?'+params, getCallback(algorithmId, algorithm));
        }
        else {
            modalMessage('No cluster selected');
        }
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
            TrendsPage.trendForm = AlgorithmsForm(trendAlgorithms, 'trend_algo_select', 'trend_param_panel', runTrendDetection, true); //TODO new?
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