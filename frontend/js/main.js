// Global application variables
var GETIOM = {
    databaseMessagesNum: null,
    filteredMessagesNum: null,
    clusterSizeArray: null,
    trendAlgorithms: null,
    clusteringTime: null,
    filteringTime: null,
    clusterAlgorithms: null,
    trendDetectionTime: null,
    currentStep: 'welcome'
};

//TODO clear data when going "back" from an advanced step....

function moveTo(step) {
    var steps = $('#progress_steps');
    var welcome = $('#welcome');
    var filter = $('#filter');
    var cluster = $('#cluster');
    var trends = $('#trends');
    var results = $('#results');
    var filterStep = $('#filterStep');
    var clusterStep = $('#clusterStep');
    var trendsStep = $('#trendsStep');
    var stepsEnum = {
        'welcome': 0,
        'filter': 1,
        'cluster': 2,
        'trends': 3,
        'results': 4
    };

    var backStep = stepsEnum[GETIOM.currentStep] >= stepsEnum[step];
    if (backStep) {
        $('#status_alert').hide();
    }

    if (step === 'filter') {
        welcome.hide();
        steps.show();
        filter.show();
        cluster.hide();
        trends.hide();
        results.hide();
        filterStep.removeClass('complete , disabled').addClass('active');
        clusterStep.removeClass('complete , active').addClass('disabled');
        trendsStep.removeClass('complete , active').addClass('disabled');
        FilterPage.init();
    }
    else if (step === 'cluster') {
        filter.hide();
        cluster.show();
        trends.hide();
        results.hide();
        filterStep.removeClass('active , disabled').addClass('complete');
        clusterStep.removeClass('complete , disabled').addClass('active');
        trendsStep.removeClass('complete , active').addClass('disabled');
        ClusterPage.init();
    }
    else if (step === 'trends') {
        filter.hide();
        cluster.hide();
        trends.show();
        results.hide();
        filterStep.removeClass('active , disabled').addClass('complete');
        clusterStep.removeClass('active , disabled').addClass('complete');
        trendsStep.removeClass('complete , disabled').addClass('active');
        if (GETIOM.currentStep !== 'results') {
            TrendsPage.init();
        }
    }
    else if (step === 'results') {
        filter.hide();
        cluster.hide();
        trends.hide();
        results.show();
        filterStep.removeClass('active , disabled').addClass('complete');
        clusterStep.removeClass('active , disabled').addClass('complete');
        trendsStep.removeClass('complete , disabled').addClass('active');
        ResultsPage.init();
        ResultsPage.show();
    }

    GETIOM.currentStep = step;
    $(window).scrollTop(0);
}

function alertMessage(msg, type) {
    var status = $('#status_alert');
    status.removeClass(['alert-success', 'alert-warning', 'alert-error']);
    status.addClass('alert-'+type);
    status.html(
        '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        //'<strong>'+ type.charAt(0).toUpperCase() + type.slice(1) +'!</strong><br>' +
        msg
    );
    status.find('.close').click(function() {
        status.hide();
    });
    status.show();
    if (type === 'danger') {
        $('html,body').animate({scrollTop: 0}, "slow");
    }
}

function successMessage(msg) {
    alertMessage(msg, 'success');
}

function errorMessage(msg) {
    alertMessage(msg, 'danger');
}


$(document).ready(function() {
    $.getJSON('trends/algorithms', function(data) {
        GETIOM.clusterAlgorithms = data.clusterAlgorithms;
        GETIOM.trendAlgorithms = data.trendAlgorithms;
    }).error(function() {
        errorMessage('Failed to retrieve trend algorithms. Please check configuration.');
    })
})