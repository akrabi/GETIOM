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
    var progressBar = $('#progress_steps');
    var progressSteps = {
        welcome: {
            page: $('#welcome'),
            index: 0
        },
        filter: {
            step: $('#filterStep'),
            page: $('#filter'),
            pageObject: FilterPage,
            index: 1
        },
        cluster: {
            step: $('#clusterStep'),
            page: $('#cluster'),
            pageObject: ClusterPage,
            index: 2
        },
        trends: {
            step: $('#trendsStep'),
            page: $('#trends'),
            pageObject: TrendsPage,
            index: 3
        },
        results: {
            page: $('#results'),
            pageObject: ResultsPage,
            index: 4
        }
    };

    var currentStep = progressSteps[step];
    var backStep = progressSteps[GETIOM.currentStep].index >= currentStep.index;
    if (backStep) {
        $('#status_alert').hide();
    }

    for (var progressStepId in progressSteps) {
        var progressStep = progressSteps[progressStepId];
        progressStep.page.hide();
        if (progressStep.step) {
            if (progressStep.index < currentStep.index) {
                progressStep.step.removeClass('active disabled').addClass('complete');
            }
            else if (progressStep.index == currentStep.index) {
                progressStep.step.removeClass('complete disabled').addClass('active');
            }
            else {
                progressStep.step.removeClass('complete active').addClass('disabled');
            }
        }
    }
    progressBar.show();
    currentStep.page.show();
    if (currentStep.pageObject) {
        currentStep.pageObject.init && currentStep.pageObject.init();
        currentStep.pageObject.show && currentStep.pageObject.show();
    }

    GETIOM.currentStep = step;
    $('html,body').animate({scrollTop: 0}, "slow");;
}



function alertMessage(msg, type) {
    var status = $('#status_alert');
    status.removeClass('alert-success alert-warning alert-danger');
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
    $('html,body').animate({scrollTop: 0}, "slow");
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