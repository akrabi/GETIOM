var average = function() {

    function standardDeviation(daysArray){
        var avg = average(daysArray.map(function(day) {return day.messages;}));

        var squareDiffs = daysArray.map(function(day){
            var diff = day.messages - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });

        var avgSquareDiff = average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }

    function average(array){
        var sum = array.reduce(function(sum, val){
            return sum + val;
        }, 0);

        var avg = sum / array.length;
        return avg;
    }

    return {
        findTrends: function(cluster, params) {
            var messagesPerDay = {};
            var daysArray = [];
            var factor = params.factor;
            cluster.forEach(function(point) {
                var date = new Date(point.properties.time*1000);
                var day = date.toDateString();
                messagesPerDay[day] = messagesPerDay[day] ? messagesPerDay[day]+1 : 1;
            });
            for (var day in messagesPerDay) {
                daysArray.push({day: day, messages: messagesPerDay[day]});
            }
            daysArray.sort(function(day1, day2) {       //TODO sort by actual date!!!!!!
                return day1.messages - day2.messages;
            });
            var avgMsgPerDay = cluster.length / daysArray.length //Number of messages divided by number of days
            var sd = standardDeviation(daysArray);

            return daysArray.filter(function(day) {
               return day.messages > avgMsgPerDay + sd*factor || day.messages < avgMsgPerDay - sd*factor;
            });

        }
    }
}();

module.exports = average;