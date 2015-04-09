var ResultsPage = {
    firstInit: true,
    trendResults: {},

    init: function() {
        for (var algorithmId in GETIOM.trendAlgorithms) {
            if (this.firstInit) {
                $('#trend_results')
                    .append(
                    '<div id="' + algorithmId + '_results" class="trend_result">' +
                    '<h4>' + GETIOM.trendAlgorithms[algorithmId].name + '</h4>' +
                    '<h4><small>' + GETIOM.trendAlgorithms[algorithmId].description + '</small></h4>' +
                    '<div id="' + algorithmId + '_results_graph" class="trend_result_graph"></div>' +
                    '</div>'
                );
            }
            $('#' + algorithmId + '_results').hide();
        }
        this.firstInit = false;
    },
    show: function() {
        // Draw Charts
        var filterData = [
            {label: "Included", data: GETIOM.filteredMessagesNum},
            {label: "Excluded", data: GETIOM.databaseMessagesNum-GETIOM.filteredMessagesNum}
        ]
        var clusterData = GETIOM.clusterSizeArray.map(function(clusterSize) {
            return {label:"", data: clusterSize};
        });
        var computationTime = [
            {label: "Filtering", data: GETIOM.filteringTime},
            {label: "Clustering", data: GETIOM.clusteringTime},
            {label: "Trend Detection", data: GETIOM.trendDetectionTime}
        ];

        var options = {
            series: {
                pie: {
                    show: true
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        };

        $.plot('#resultsFilterChart', filterData, options);
        $.plot('#resultsClusterChart', clusterData, options);
        $.plot('#resultsComputationChart', computationTime, options);

        var trendResults = ResultsPage.trendResults;
        for (var trendAlgoId in trendResults) {
            var trendAlgo = trendResults[trendAlgoId];
            var plotDataArray = trendAlgo.plotData;
            var plotOptions = trendAlgo.plotOptions;

            $('#' + trendAlgoId + '_results').show();

            var resultsGraph = '#' + trendAlgoId + '_results_graph';

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
        }
    }
};