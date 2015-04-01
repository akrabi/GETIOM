function runKM() {
    $('#processingModal').modal();
    var domobj = document.getElementById('KM-K');
    var K = parseInt(domobj.options[domobj.selectedIndex].value);

    GETIOM.clusteringTime = Date.now();
    $.getJSON('cluster/kmeans?k='+K, function( data ) {
        GETIOM.clusterSizeArray = data;
        if (GETIOM.clusterSizeArray && GETIOM.clusterSizeArray.length > 0) {
            var t2 = Date.now();
            var ms = t2 - GETIOM.clusteringTime;     //time in milliseconds
            GETIOM.clusteringTime = ms / 1000;
            clusteringDone();
        }
        else {
            clusteringError('No result (too many clusters/too few different instances (try changing K)');
        }
    });

}

function runHC() {
    $('#processingModal').modal();
    var linkage = parseInt(radioValue('linkage'));
    var distance = parseInt(radioValue('distance'));
    var threshold = parseInt($('input[name="threshold"]').val());

    GETIOM.clusteringTime = Date.now();
    $.getJSON('cluster/hierarchical?linkage='+linkage+'&distance='+distance+'&threshold='+threshold, function( data ) {
        GETIOM.clusterSizeArray = data;
        var t2 = Date.now();
        var ms = t2-GETIOM.clusteringTime;     //time in milliseconds
        GETIOM.clusteringTime = ms / 1000;
        clusteringDone();
    });
}


function runGrid() {
    $('#processingModal').modal();
    var optional = parseInt($('input[name="optional"]').val());
    //TODO: Get more options from the Control Panel
    GETIOM.clusteringTime = Date.now();
    $.getJSON('cluster/grid', function( data ) {
        //TODO: Add some logic here.

        GETIOM.clusterSizeArray = data;
        var t2 = Date.now();
        var ms = t2-GETIOM.clusteringTime;     //time in milliseconds
        GETIOM.clusteringTime = ms / 1000;
        clusteringDone();
    });
}

function radioValue(name) {
    var radios = $('input[name='+name+']');
    for (var i = 0; i < radios.length; i++)
        if (radios[i].checked)
            return radios[i].value;
}

function clusteringDone() {
    $.getJSON('convexhulls', function(data) {
        GETIOM.convexHulls = data;
        $('#processingModal').modal('hide');
        modalMessage('Clustered ' + GETIOM.filteredMessagesNum + ' messages into ' + GETIOM.clusterSizeArray.length + ' clusters in ' + GETIOM.clusteringTime + ' seconds!');
        moveTo('trends');
    });
}

function clusteringError(msg) {
    $('#processingModal').modal('hide');
    modalMessage(msg);
    moveTo('trends');
}

$(document).ready(function () {
    var clusterForm = new SelectiveForm(['kmeans', 'hierarchical', 'grid'], ['km_panel', 'hc_panel','grid_panel'], 'cluster_algo_select', [runKM, runHC, runGrid]);
    clusterForm.init();
    $('#submitCluster').click(function() {
        clusterForm.submit();
    })
});
