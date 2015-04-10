function runTrendDetection(algorithmIds){
    var clusterIndex = TrendsPage.map.getSelectedClusterIndex();

    if (clusterIndex < 0) {
        errorMessage('<strong>No cluster selected</strong>');
        return;
    }

    var algoCount = algorithmIds.length;

    if (algoCount <= 0) {
        errorMessage('<strong>No algorithms selected</strong>');
        return
    }

    TrendsPage.results = '';
    TrendsPage.completedAlgoCount = 0;

    ResultsPage.trendResults = {};

    $('#processingModal').modal();
    GETIOM.trendDetectionTime = Date.now();

    for (var i=0; i<algoCount; ++i){

        var algorithmId = algorithmIds[i];
        var algorithm = GETIOM.trendAlgorithms[algorithmId];

        var params = '';
        var count = 0;

        for (var param in algorithm.params) {
            if (count > 0) {
                params += '&';
            }
            params += param + '=' + $('input[name="'+algorithmId+'_' + param +'"]').val();
        }

        $.getJSON('trends/'+algorithmId+'/'+clusterIndex+'?'+params, getCallback(algorithmId, algorithm, algoCount))
            .error(function() {
                $('#processingModal').modal('hide');
                errorMessage('<strong>Failed to run trend algorithm.</strong><br>Check that the server is up and running');
            });

    }
}


function getCallback(algorithmId, algorithm, algoCount) {
    return function (data) {
        TrendsPage.completedAlgoCount++;

        var plotDataArray = $.extend(true, [], algorithm.plotData); // Cloning needed because we're changing it.
        var plotOptions = algorithm.plotOptions;

        if (!data || data.trendsNum === 0) {
            TrendsPage.results += '<u>' + algorithm.name + '</u>: No trends found<br>';
        }
        else {
            TrendsPage.results += '<u>' + algorithm.name + '</u>: Found ' + data.trendsNum + ' trends. <br>';

            plotDataArray.forEach(function (plotData) {
                plotData.data = data[plotData.data];
            });

            ResultsPage.trendResults[algorithmId] = {plotData: plotDataArray, plotOptions: plotOptions};

        }
        if (TrendsPage.completedAlgoCount >= algoCount) {
            GETIOM.trendDetectionTime = (Date.now()-GETIOM.trendDetectionTime) / 1000;
            TrendsPage.results = '<strong>Finished trend detection in ' + GETIOM.trendDetectionTime + ' seconds.</strong><br>' + TrendsPage.results;
            $('#processingModal').modal('hide');
            successMessage(TrendsPage.results);
            moveTo('results');
        }
    }
}

var TrendsPage = {
    map: null,
    trendForm: null,
    results: '',
    completedAlgoCount: 0,
    init: function() {
        this.completedAlgoCount = 0;
        if (!TrendsPage.trendForm) {
            var trendAlgorithms = GETIOM.trendAlgorithms;
            TrendsPage.trendForm = AlgorithmsForm(trendAlgorithms, 'trend_algo_select', 'trend_param_panel', runTrendDetection, true);
            TrendsPage.trendForm.init();
        }
        var map = new Map($('#resultsMap')[0]);
        this.map = map;
        map.init(40.821715, -74.122381); //TODO optimize zoom and location to display results
        TrendsPage.loadPolygons(map);
    },
    loadPolygons: function (map) {
        for (var i=0; i < GETIOM.convexHulls.length; ++i) {
            var hull = GETIOM.convexHulls[i];
            var hullPoints = hull.map(function (point) {
                return new google.maps.LatLng(point[0], point[1]);
            });
            map.addClusterPolygon(hullPoints, GETIOM.clusterSizeArray[i]);
        }
        if (GETIOM.convexHulls.length === 1) {  // If there's a single cluster, select it
            map.setSelectedClusterIndex(0);
        }
    }
}

$(document).ready(function() {
    $('#submitTrend').click(function() {
        TrendsPage.trendForm.submit();
    });
});