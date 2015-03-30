var RunningAverage = function() {
    var trendUtils = require('./trendUtils.js');
    return {
        findTrends: function(cluster, params) {
            var threshold = params.threshold;
            var messagesPerDay = trendUtils.findMessagesPerDay(cluster);
            var daysArray = [];
            for (var day in messagesPerDay) {
                daysArray.push([parseInt(day), messagesPerDay[day]]);
            }
            daysArray.sort(function(dayObject1, dayObject2) {
                return dayObject1[0] - dayObject2[0];
            })


            var messages = 0;
            var average = 0;
            var trends = [];
            var averages = [];

            for (var i=0; i<daysArray.length; ++i) {
                messages += daysArray[i][1];
                var previousAverage = average;
                average = messages / (i+1);
                averages.push([daysArray[i][0], average]);
                var slope = (average - previousAverage) / 2;
                if (Math.abs(slope) > threshold) {
                    trends.push(daysArray[i]);
                }
            }
            return {trends: trends,
                    additional: {
                        averages: averages
                    }};
        }
    }
}();


module.exports = RunningAverage;
