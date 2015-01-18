function runAlgo() {
    var algo = $('#algo').val();
    switch (algo) {
        case 'kmeans':
        {
            runKM();
            break;
        }
        case 'hierarchical':
        {
            runHC();
            break;
        }
        case 'fcmeans':
        {
            runFCM();
            break;
        }
    }
}

function showParamPanel(visiblePanel) {
    var panelNames = ['km_panel', 'fcm_panel', 'hc_panel'];
    for (var i = 0; i < panelNames.length; i++) {
        $('#'+panelNames[i]).hide();
    }
    $('#'+visiblePanel).show();
}

function updateAlgo() {
    var algo = $('#algo').val();
    switch (algo) {
        case 'kmeans':
        {
            showParamPanel('km_panel');
            break;
        }
        case 'hierarchical':
        {
            showParamPanel('hc_panel');
            break;
        }
        case 'fcmeans':
        {
            showParamPanel('fcm_panel');
            break;
        }
    }
}

function runKM() {
    var domobj = document.getElementById('KM-K');
    var K = parseInt(domobj.options[domobj.selectedIndex].value);

    var clusters = figue.kmeans(K, GETIOM.filteredMessages, metric);

    var txt;
    if (clusters) {
        txt = "<table border='1'>";
        txt += "<tr><th>Label</th><th>Vector</th><th>Cluster id</th><th>Cluster centroid</th></tr>";

        for (var i = 0; i < vectors.length; i++) {
            var index = clusters.assignments[i];
            txt += "<tr><td>" + labels[i] + "</td><td>" + vectors[i] + "</td><td>" + index + "</td><td>" + clusters.centroids[index] + "</td></tr>";
        }
        txt += "</table>"
    } else
        txt = "No result (too many clusters/too few different instances (try changing K)";
    document.getElementById('text').innerHTML = txt;
}

function runHC() {

    var linkage = parseInt(radioValue('linkage'));
    var distance = parseInt(radioValue('distance'));
    var threshold = parseInt($('input[name="threshold"]').val());
    var t1 = Date.now();
    GETIOM.clusters = HCluster.clusterMessages(GETIOM.filteredMessages, distance, linkage, threshold);
    var t2 = Date.now();
    var ms = t2-t1;     //time in milliseconds
    GETIOM.time = ms / 1000;
}

function runFCM() {
    var vectors = data['vectors'];
    var labels = data['labels'];
    var domobj = document.getElementById('FCM-K');
    var K = parseInt(domobj.options[domobj.selectedIndex].value);
    var fuzziness = parseInt(document.getElementById('fuzziness').value);
    var epsilon = parseInt(document.getElementById('epsilon').value);

    var clusters = figue.fcmeans(K, vectors, epsilon, fuzziness);

}

function radioValue(name) {
    var radios = $('input[name='+name+']');
    for (var i = 0; i < radios.length; i++)
        if (radios[i].checked)
            return radios[i].value;
}

$(document).ready(function () {
    updateAlgo();
});

$('#submitCluster').click(function() {
    runAlgo();
    var resultsModal = $('#resultsModal');
    resultsModal.find('.modal-body').html('Clustered ' + GETIOM.filteredMessages.length + ' messages into ' + GETIOM.clusters.length + ' clusters in ' + GETIOM.time + ' seconds!')
    resultsModal.modal();
    moveTo('results');
})
