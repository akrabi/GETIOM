function runClusterAlgorithm(algorithmId){
    var algorithm = GETIOM.clusterAlgorithms[algorithmId];
    var params = '';
    var count = 0;

    for (var param in algorithm.params) {
        if (count > 0) {
            params += '&';
        }
        params += param + '=' + $('input[name="'+algorithmId+'_' + param +'"]').val();
    }
    getClusters('cluster/'+algorithmId+'?'+params);
}


function getClusters(url) {
    $('#processingModal').modal();
    GETIOM.clusteringTime = Date.now();
    $.getJSON(url, function( data ) {
        GETIOM.clusterSizeArray = data;
        var t2 = Date.now();
        var ms = t2-GETIOM.clusteringTime;     //time in milliseconds
        GETIOM.clusteringTime = ms / 1000;
        $.getJSON('convexhulls', function(data) {
            GETIOM.convexHulls = data;
            $('#processingModal').modal('hide');
            successMessage('<strong>Clustered ' + GETIOM.filteredPointsNum + ' data points into ' + GETIOM.clusterSizeArray.length + ' clusters in ' + GETIOM.clusteringTime + ' seconds!</strong>');
            moveTo('trends');
        }).error(function() {
            clusteringError('<strong>Failed to bound clusters.</strong><br>Check that the server is up and running');
        });
    }).error(function() {
        clusteringError('<strong>Failed to cluster.</strong><br>Check that the server is up and running');
    });
}


function clusteringError(msg) {
    $('#processingModal').modal('hide');
    errorMessage(msg);
}

var ClusterPage = {
    clusterForm: null,
    init: function() {
        if (!ClusterPage.clusterForm) {
            var clusterAlgorithms = GETIOM.clusterAlgorithms;
            ClusterPage.clusterForm = AlgorithmsForm(clusterAlgorithms, 'cluster_algo_select', 'cluster_param_panel', runClusterAlgorithm, false);
            ClusterPage.clusterForm.init();
        }
    }
};

$(document).ready(function () {
    $('#submitCluster').click(function() {
        ClusterPage.clusterForm.submit();
    });
    $('#skipCluster').click(function() {
        getClusters('/cluster/skip');
    });
});
