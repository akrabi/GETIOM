var ResultsPage = {
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
            {label: "Clustering", data: GETIOM.clusteringTime}
        ]

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
    }
};