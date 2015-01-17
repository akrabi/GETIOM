var clusters;
function parseData(data) {
    var labels = new Array();
    var vectors = new Array();
    lines = data.split("\n");
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length == 0)
            continue;
        var elements = lines[i].split(",");
        var label = elements.shift();
        var vector = new Array();
        for (j = 0; j < elements.length; j++)
            vector.push(parseFloat(elements[j]));
        vectors.push(vector);
        labels.push(label);
    }
    return {'labels': labels, 'vectors': vectors};
}

function runAlgo() {
    var domobj = document.getElementById('algo');
    var algo = domobj.options[domobj.selectedIndex].value;
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
    for (var i = 0; i < panelNames.length; i++)
        document.getElementById(panelNames[i]).style.display = 'none';
    document.getElementById(visiblePanel).style.display = 'block';
}

function updateAlgo() {
    var domobj = document.getElementById('algo');
    var algo = domobj.options[domobj.selectedIndex].value;
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
    /*var data = parseData(document.getElementById('data').value);
    var vectors = data['vectors'];
    var labels = data['labels'];*/
    var domobj = document.getElementById('KM-K');
    var K = parseInt(domobj.options[domobj.selectedIndex].value);

    var clusters = figue.kmeans(K, filteredMessages, metric);

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
    /*var data = parseData(document.getElementById('data').value);
    var domobj = document.getElementById('space');
    var space = parseInt(domobj.options[domobj.selectedIndex].value);
    var balanced = (radioValue('balanced') === 'true');
    var withLabel = (radioValue('withLabel') === 'true');
    var withCentroid = (radioValue('withCentroid') === 'true');
    var withDistance = (radioValue('withDistance') === 'true');
    var linkage = parseInt(radioValue('linkage'));
    var distance = parseInt(radioValue('distance'));
    root = figue.agglomerate(data['labels'], data['vectors'], distance, linkage);
    var pre = document.getElementById('text');
    var text = root.buildDendogram(space, balanced, withLabel, withCentroid, withDistance);
    if (document.all) {
        pre.innerText = text;
    } else {
        pre.innerHTML = text;
    }*/

    alert(filteredMessages.length);
    var clusters = HCluster.clusterMessages(filteredMessages, 'average');
    alert(clusters.length);
}

function runFCM() {
    var data = parseData(document.getElementById('data').value);
    var vectors = data['vectors'];
    var labels = data['labels'];
    var domobj = document.getElementById('FCM-K');
    var K = parseInt(domobj.options[domobj.selectedIndex].value);
    var fuzziness = parseInt(document.getElementById('fuzziness').value);
    var epsilon = parseInt(document.getElementById('epsilon').value);

    var clusters = figue.fcmeans(K, vectors, epsilon, fuzziness);

    var txt;
    if (clusters) {
        txt = "<table border='1'>";
        txt += "<tr><th>Cluster id</th><th>Cluster centroid</th></tr>";

        for (var i = 0; i < K; i++) {
            txt += "<tr><td>" + i + "</td><td>" + clusters.centroids[i] + "</td></tr>";
        }
        txt += "</table>"
        txt += "<br/>"
        txt += clusters.membershipMatrix;

    } else
        txt = "No result (too many clusters/too few different instances (try changing K)";
    document.getElementById('text').innerHTML = txt;
}

function radioValue(name) {
    var radios = document.getElementsByName(name);
    for (var i = 0; i < radios.length; i++)
        if (radios[i].checked)
            return radios[i].value;
}

window.onload = function () {
    updateAlgo();
}

$('#submitCluster').click(function() {
    runAlgo();
    moveTo('results');
})
