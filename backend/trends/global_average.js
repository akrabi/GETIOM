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
            var daysArray = trendUtils.daysArray(messagesPerDay);
            var threshold = parseFloat(params.threshold);

            var avg = cluster.length / daysArray.length //Number of messages divided by number of days
            var sd = standardDeviation(daysArray);

            var daysNum = daysArray.length;

            if (daysNum < 2) {
                return null;
            }

            var averagePoints = [];
            var bottomSDPoints = [];
            var topSDPoints = [];
            var trends = [];
            
            for (var i=0; i<daysNum; ++i) {
                var day = daysArray[i][0];
                var messages = daysArray[i][1];
                if (messages > avg + sd*threshold || messages < avg - sd*threshold) {
                    trends.push(daysArray[i]);
                }
                topSDPoints.push([day, avg + sd*threshold]);
                averagePoints.push([day, avg]);
                bottomSDPoints.push([day, avg - sd*threshold]);
            }

            return {
                trendsNum: trends.length,
                daysNum: daysNum,
                messagesNum: cluster.length,
                days: daysArray,
                trends: trends,
                topSDPoints: topSDPoints,
                averagePoints: averagePoints,
                bottomSDPoints: bottomSDPoints
            }
        }
    }
}();

module.exports = StandardDeviation;