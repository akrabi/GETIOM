var RunningAverage = function() {
    var trendUtils = require('./trendUtils.js');
    return {
        findTrends: function(cluster, params) {
            var threshold = params.threshold;
            var messagesPerDay = trendUtils.findMessagesPerDay(cluster);
            var daysArray = trendUtils.daysArray(messagesPerDay);

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
                if (Math.abs(slope) > threshold && i>0) {
                    trends.push(daysArray[i]);
                }
            }
            return {trends: trends,
                    additional: {
                        days: daysArray,
                        messagesNum: cluster.length,
                        averages: averages
                    }};
        }
    }
}();


module.exports = RunningAverage;
