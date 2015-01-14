var TimeSlider = function(domNode) {
    var domNode = domNode;

    var startVal = 0;
    var endVal = 1435;

    function getTime(sliderVal) {
        var minutes = parseInt(sliderVal % 60, 10);
        var hours = parseInt(sliderVal / 60 % 24, 10);
        minutes = minutes + '';
        hours = hours + '';
        if (minutes.length == 1) {
            minutes = '0' + minutes;
        }
        if (hours.length == 1) {
            hours = '0' + hours;
        }
        return hours + ':' + minutes;
    }

    return {

        init: function() {

            // Create a wrapping container
            $(domNode).wrap( '<div class="container"></div>' );

            $(domNode).slider({
                range: true,
                min: 0,
                max: 1439,
                step: 5,
                values: [startVal, endVal],
                slide: function (event, ui) {
                    // Allow time for exact positioning
                    setTimeout(function () {
                        $(ui.handle).attr('title', getTime(ui.value)).tooltip('fixTitle').tooltip('show');
                    }, 5);
                },
                create: function (event, ui) {
                    var target = $(event.target);
                    var handles = $(event.target).find('.ui-slider-handle');
                    var container, wait;

                    // Wait for the slider to be in position
                    (wait = function () {
                        if ((container = target.parents('.container')).length != 0) {
                            handles.eq(0).tooltip({
                                animation: false,
                                placement: 'bottom',
                                trigger: 'manual',
                                container: container,
                                title: getTime(startVal)
                            }).tooltip('show');
                            handles.eq(1).tooltip({
                                animation: false,
                                placement: 'bottom',
                                trigger: 'manual',
                                container: container,
                                title: getTime(endVal)
                            }).tooltip('show');
                        } else {
                            setTimeout(wait, 50);
                        }
                    })();
                }
            });
        },

        getTimeRange: function() {
            return {start: getTime(startVal), end: getTime(endVal)}
        }

    }
};