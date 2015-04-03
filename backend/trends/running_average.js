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
            var runningAverage = [];
            var runningAveragePlusThreshold = [];
            var runningAverageMinusThreshold = [];

            for (var i=0; i<daysArray.length; ++i) {
                messages += daysArray[i][1];
                //var previousAverage = average;
                average = messages / (i+1);
                runningAverage.push([daysArray[i][0], average]);
                runningAveragePlusThreshold.push([daysArray[i][0], average+(threshold/100)*average]);
                runningAverageMinusThreshold.push([daysArray[i][0], average-(threshold/100)*average]);
                //var slope = (average - previousAverage) / 2;
                if (Math.abs(daysArray[i][1]-average) > (threshold/100)*average && i>0) {
                    trends.push(daysArray[i]);
                }
            }
            return {
                trendsNum: trends.length,
                daysNum: daysArray.length,
                messagesNum: cluster.length,
                days: daysArray,
                trends: trends,
                runningAverage: runningAverage,
                runningAveragePlusThreshold: runningAveragePlusThreshold,
                runningAverageMinusThreshold: runningAverageMinusThreshold
            };
        }
    }
}();


module.exports = RunningAverage;
