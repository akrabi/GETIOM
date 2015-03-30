var LinearRegression = function() {
    var trendUtils = require('./trendUtils.js');
    function findLineByLeastSquares(values) {
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var count = 0;

        /*
         * We'll use those variables for faster read/write access.
         */
        var x = 0;
        var y = 0;
        var values_length = values.length;

        /*
         * Nothing to do.
         */
        if (values_length === 0) {
            return [ [], [] ];
        }

        /*
         * Calculate the sum for each of the parts necessary.
         */
        for (var i = 0; i < values_length; i++) {
            x = values[i][0];
            y = values[i][1];
            sum_x += x;
            sum_y += y;
            sum_xx += x*x;
            sum_xy += x*y;
            count++;
        }

        /*
         * Calculate m and b for the formular:
         * y = x * m + b
         */
        var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
        var b = (sum_y/count) - (m*sum_x)/count;

        return [m, b];
    }

    return {
        findTrends: function(cluster, params) {
            var threshold = params.threshold;
            var messagesPerDay = trendUtils.findMessagesPerDay(cluster);
            var daysArray = [];
            for (var day in messagesPerDay) {
                daysArray.push([day, messagesPerDay[day]]);
            }
            var line = findLineByLeastSquares(daysArray);
            var f = function(x) {return line[0]*x+line[1]};

            var trends = [];
            var linePoints = [];

            for (var day in messagesPerDay) {
                if (f(day) > threshold) {
                    trends.push([day, messagesPerDay[day]]);
                    linePoints.push([day, f(day)]);
                }
            }
            return {
                trends: trends,
                additional: {
                    days: daysArray,
                    messagesNum: cluster.length,
                    line: linePoints
                }
            };
        }
    };
}();


module.exports = LinearRegression;
