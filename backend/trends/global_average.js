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
            var pointsPerDay = trendUtils.findPointsPerDay(cluster);
            var daysArray = trendUtils.daysArray(pointsPerDay);
            var threshold = parseFloat(params.threshold);

            var avg = cluster.length / daysArray.length //Number of points divided by number of days
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
                var points = daysArray[i][1];
                if (points > avg + sd*threshold || points < avg - sd*threshold) {
                    trends.push(daysArray[i]);
                }
                topSDPoints.push([day, avg + sd*threshold]);
                averagePoints.push([day, avg]);
                bottomSDPoints.push([day, avg - sd*threshold]);
            }

            return {
                trendsNum: trends.length,
                daysNum: daysNum,
                pointsNum: cluster.length,
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