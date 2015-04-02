function runKM() {
    $('#processingModal').modal();
    var domobj = document.getElementById('KM-K');
    var K = parseInt(domobj.options[domobj.selectedIndex].value);

    var url = 'cluster/kmeans?k='+K;
    GETIOM.clusteringTime = Date.now();
    getClusters(url);
}

function runHC() {
    $('#processingModal').modal();
    var linkage = parseInt(radioValue('linkage'));
    var distance = parseInt(radioValue('distance'));
    var threshold = parseInt($('input[name="threshold"]').val());

    var url = 'cluster/hierarchical?linkage='+linkage+'&distance='+distance+'&threshold='+threshold;
    GETIOM.clusteringTime = Date.now();
    getClusters(url);
}


function runGrid() {
    //TODO implement?
}

function radioValue(name) {
    var radios = $('input[name='+name+']');
    for (var i = 0; i < radios.length; i++)
        if (radios[i].checked)
            return radios[i].value;
}

function getClusters(url) {
    $.getJSON(url, function( data ) {
        GETIOM.clusterSizeArray = data;
        var t2 = Date.now();
        var ms = t2-GETIOM.clusteringTime;     //time in milliseconds
        GETIOM.clusteringTime = ms / 1000;
        $.getJSON('convexhulls', function(data) {
            GETIOM.convexHulls = data;
            $('#processingModal').modal('hide');
            modalMessage('Clustered ' + GETIOM.filteredMessagesNum + ' messages into ' + GETIOM.clusterSizeArray.length + ' clusters in ' + GETIOM.clusteringTime + ' seconds!');
            moveTo('trends');
        }).error(function() {
            clusteringError('Error!<br> Failed to bound clusters.<br>Check that the server is up and running');
        });
    }).error(function() {
        clusteringError('Error!<br> Failed to cluster.<br>Check that the server is up and running');
    });
}

function getClustersHulls() {

}

function clusteringError(msg) {
    $('#processingModal').modal('hide');
    modalMessage(msg);
}

$(document).ready(function () {
    var clusterForm = new SelectiveForm(['kmeans', 'hierarchical', 'grid'], ['km_panel', 'hc_panel','grid_panel'], 'cluster_algo_select', [runKM, runHC, runGrid]);
    clusterForm.init();
    $('#submitCluster').click(function() {
        clusterForm.submit();
    });
    $('#skipCluster').click(function() {
        getClusters('/cluster/skip');
    });
});
