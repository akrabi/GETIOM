var ResultsPage = {
    init: function() {
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
    }
};