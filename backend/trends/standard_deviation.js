var StandardDeviation = function() {
    var trendUtils = require('./trendUtils.js');
    function standardDeviation(daysArray){
        var avg = trendUtils.average(daysArray.map(function(day) {return day.messages;}));

        var squareDiffs = daysArray.map(function(day){
            var diff = day.messages - avg;
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
                daysArray.push({day: day, messages: messagesPerDay[day]});
            }
            daysArray.sort(function(day1, day2) {       //TODO sort by actual date!!!!!!
                return day1.messages - day2.messages;
            });
            var avgMsgPerDay = cluster.length / daysArray.length //Number of messages divided by number of days
            var sd = standardDeviation(daysArray);

            var trends = daysArray.filter(function(day) {
               return day.messages > avgMsgPerDay + sd*factor || day.messages < avgMsgPerDay - sd*factor;
            });

            return {
                trends: trends,
                additional: {
                    average: avgMsgPerDay,
                    sd: sd
                }
            }

        }
    }
}();

module.exports = StandardDeviation;