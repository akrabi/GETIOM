var timeRangeSliderStartTime;
var timeRangeSliderEndTime;

$("#time").text('12:00 AM - 11:50 PM');
var timeRangeSlider = $("#slider-range");

timeRangeSlider.slider({
    range: true,
    min: 0,
    max: 1435,
    values: [0, 1435],
    step:5,
    slide: slideTime,
    change: slideTime
});

function slideTime(){
    var val0 = timeRangeSlider.slider("values", 0),
        val1 = timeRangeSlider.slider("values", 1),
        minutes0 = parseInt(val0 % 60, 10),
        hours0 = parseInt(val0 / 60 % 24, 10),
        minutes1 = parseInt(val1 % 60, 10),
        hours1 = parseInt(val1 / 60 % 24, 10);

    startTime = getTime(hours0, minutes0);
    endTime = getTime(hours1, minutes1);
    $("#time").text(startTime + ' - ' + endTime);
}

function getTime(hours, minutes) {
    var time = null;
    minutes = minutes + '';
    if (hours < 12) {
        time = 'AM';
    }
    else {
        time = 'PM';
    }
    if (hours == 0) {
        hours = 12;
    }
    if (hours > 12) {
        hours = hours - 12;
    }
    if (minutes.length == 1) {
        minutes = '0' + minutes;
    }
    hours = hours + '';
    if (hours.length == 1) {
        hours = '0' + hours;
    }
    return hours + ':' + minutes + ' ' + time;

    //TODO check this option:
    /*var milliseconds = minutes*60*1000;
    var from = new Date(milliseconds);

    var hourTime = (from.getHours().toString().length == 1) ? '0' + from.getHours().toString():from.getHours().toString();
    var minuTime = (from.getMinutes().toString().length == 1) ? '0' + from.getMinutes().toString():from.getMinutes().toString();

    return hourTime + ':' + minuTime;*/
}