// Global application variables
var GETIOM = {
    databaseMessagesNum: null,
    filteredMessagesNum: null,
    clusterSizeArray: null,
    clusteringTime: null,
    filteringTime: null,
    trendDetectionTime: null,
    currentStep: 'welcome',
    gridData: null
};

//TODO clear data when going "back" from an advanced step....

function moveTo(step) {
    var welcome = $('#welcome');
    var steps = $('#progress_steps');
    var filter = $('#filter');
    var cluster = $('#cluster');
    var trends = $('#trends');
    var results = $('#results');
    var filterStep = $('#filterStep');
    var clusterStep = $('#clusterStep');
    var trendsStep = $('#trendsStep');

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
    }

    GETIOM.currentStep = step;
    $(window).scrollTop(0);
}


function modalMessage(msg) { //TODO add title option, build html around title and msg
    var resultsModal = $('#resultsModal');
    resultsModal.find('.modal-body').html(msg);
    resultsModal.modal();
}