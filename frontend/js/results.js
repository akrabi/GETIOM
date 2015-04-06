var ResultsPage = {
    firstInit: true,

    init: function() {
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


        if (this.firstInit) {
            for (var algorithmId in GETIOM.trendAlgorithms) {
                $('#trend_results')
                    .append(
                    '<div id="' + algorithmId + '_results" class="trend_result">' +
                    '<h4>' + GETIOM.trendAlgorithms[algorithmId].name + '</h4>' +
                    '<h4><small>' + GETIOM.trendAlgorithms[algorithmId].description + '</small></h4>' +
                    '<div id="' + algorithmId + '_results_graph" class="trend_result_graph"></div>' +
                    '</div>'
                );
                $('#' + algorithmId + '_results').hide();
            }
            this.firstInit = false;
        }
    }
};