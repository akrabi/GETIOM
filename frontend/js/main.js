// Global application variables
var GETIOM = {
    databaseMessagesNum: null,
    filteredMessagesNum: null,
    clusterSizeArray: null,
    clusteringTime: null,
    filteringTime: null,
    gridData: null
};

//TODO clear data when going "back" from an advanced step....

function moveTo(step) {
    var filter = $('#filter');
    var cluster = $('#cluster');
    var trends = $('#trends');
    var results = $('#results');
    var filterStep = $('#filterStep');
    var clusterStep = $('#clusterStep');
    var trendsStep = $('#trendsStep');

    if (step === 'filter') {
        filter.show();
        cluster.hide();
        trends.hide();
        results.hide();
        filterStep.removeClass('complete , disabled').addClass('active');
        clusterStep.removeClass('complete , active').addClass('disabled');
        trendsStep.removeClass('complete , active').addClass('disabled');
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
        TrendsPage.init();
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
    $(window).scrollTop(0);
}


function modalMessage(msg) { //TODO add title option, build html around title and msg
    var resultsModal = $('#resultsModal');
    resultsModal.find('.modal-body').html(msg);
    resultsModal.modal();
}