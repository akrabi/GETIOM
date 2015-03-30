var StandardDeviation = function() {
    var trendUtils = require('./trendUtils.js');
    function standardDeviation(daysArray){
        var avg = trendUtils.average(daysArray.map(function(day) {return day[1];}));

        var squareDiffs = daysArray.map(function(day){
            var diff = day[1] - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });

        var avgSquareDiff = trendUtils.average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }


    return {
        findTrends: function(cluster, params) {
            var messagesPerDay = trendUtils.findMessagesPerDay(cluster);
            var daysArray = [];
            var factor = params.factor;

            for (var day in messagesPerDay) {
                daysArray.push([parseInt(day), messagesPerDay[day]]);
            }

            var avgMsgPerDay = cluster.length / daysArray.length //Number of messages divided by number of days
            var sd = standardDeviation(daysArray);

            var trends = daysArray.filter(function(day) {
               return day[1] > avgMsgPerDay + sd*factor || day[1] < avgMsgPerDay - sd*factor;
            });

            return {
                trends: trends,
                additional: {
                    days: daysArray,
                    messagesNum: cluster.length,
                    avg: avgMsgPerDay,
                    sd: sd
                }
            }

        }
    }
}();

module.exports = StandardDeviation;