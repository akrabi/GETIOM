// Global application variables
var GETIOM = {
    databaseMessagesNum: null,
    filteredMessagesNum: null,
    clusterSizeArray: null,
    clusteringTime: null,
    filteringTime: null
};

function moveTo(step) {
    var filter = $('#filter');
    var cluster = $('#cluster');
    var results = $('#results');
    var filterStep = $('#filterStep');
    var clusterStep = $('#clusterStep');
    var resultsStep = $('#resultsStep');

    if (step === 'filter') {
        filter.show();
        cluster.hide();
        results.hide();
        filterStep.removeClass('complete , disabled').addClass('active');
        clusterStep.removeClass('complete , active').addClass('disabled');
        resultsStep.removeClass('complete , active').addClass('disabled');
    }
    else if (step === 'cluster') {
        filter.hide();
        cluster.show();
        results.hide();
        filterStep.removeClass('active , disabled').addClass('complete');
        clusterStep.removeClass('complete , disabled').addClass('active');
        resultsStep.removeClass('complete , active').addClass('disabled');
    }
    else if (step === 'results') {
        filter.hide();
        cluster.hide();
        results.show();
        filterStep.removeClass('active , disabled').addClass('complete');
        clusterStep.removeClass('active , disabled').addClass('complete');
        resultsStep.removeClass('complete , disabled').addClass('active');
        ResultsPage.init();
    }
    $( window ).scrollTop( 0 );
}
