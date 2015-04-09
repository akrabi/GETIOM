function runTrendDetection(algorithmIds){
    var clusterIndex = TrendsPage.map.getSelectedClusterIndex();

    if (clusterIndex < 0) {
        errorMessage('No cluster selected');
        return;
    }

    var algoCount = algorithmIds.length;

    TrendsPage.results = '';
    TrendsPage.completedAlgoCount = 0;

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
                errorMessage('Failed to run trend algorithm.<br>Check that the server is up and running');
            });

    }
}


function getCallback(algorithmId, algorithm, algoCount) {
    return function (data) {
        TrendsPage.completedAlgoCount++;

        var plotDataArray = $.extend(true, [], algorithm.plotData); // Cloning needed because we're changing it.
        var plotOptions = algorithm.plotOptions;

        if (!data || data.trendsNum === 0) {
            TrendsPage.results += 'No trends found for '+ algorithm.name +'!' + '<br><br>';
        }
        else {
            TrendsPage.results +=
                algorithm.name + '<br>' +
                'Messages: ' + data.messagesNum + '<br>' +
                'Days: ' + data.daysNum + '<br>' +
                'Trends: ' + data.trendsNum + '<br><br>';

            if (TrendsPage.completedAlgoCount === 1) {
                ResultsPage.init();
            }

            $('#results').show(); // Essential for flot graphs

            plotDataArray.forEach(function (plotData) {
                plotData.data = data[plotData.data];
            });


            $('#' + algorithmId + '_results').show();

            var resultsGraph = '#' + algorithmId + '_results_graph';

            $.plot(resultsGraph, plotDataArray, plotOptions);
            $(resultsGraph).bind("plotclick", function (event, pos, item) {
                if (item) {
                    var day = item.datapoint[0];
                    var url = 'http://www.google.com/search?q=' + 'Manhattan ' + new Date(day).toJSON().slice(0,10);
                    window.open(url, '_blank');
                }
            });

            function showTooltip(x, y, contents) {
                $('<div id="tooltip">' + contents + '</div>').css( {
                    position: 'absolute', display: 'none', top: y + 5, left: x + 5,
                    border: '1px solid #fdd', padding: '2px', 'background-color': '#fee', opacity: 0.80
                }).appendTo("body").fadeIn(200);
            }
            $(resultsGraph).bind("plothover", function (event, pos, item) {
                $("#tooltip").remove();
                if (item) {
                    var day = item.datapoint[0];
                    var messages = item.datapoint[1];
                    showTooltip(item.pageX, item.pageY,
                        'Trend!<br>'+
                        (new Date(day)).toJSON().slice(0,10) + '<br>' +
                        parseInt(messages) + ' messages');
                }
            });


            $('#results').hide()
        }
        if (TrendsPage.completedAlgoCount >= algoCount) {
            GETIOM.trendDetectionTime = (Date.now()-GETIOM.trendDetectionTime) / 1000;
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