module.exports = {
    average: function (array) {
        var sum = array.reduce(function (sum, val) {
            return sum + val;
        }, 0);

        var avg = sum / array.length;
        return avg;
    },
    findMessagesPerDay: function(cluster) {
        var messagesPerDay = {};
        cluster.forEach(function(point) {
            var day = Math.floor(point.properties.time/86400)*86400000; // Convert unix timestamp to day in miliseconds
            messagesPerDay[day] = messagesPerDay[day] ? messagesPerDay[day]+1 : 1;
        });
        return messagesPerDay;
    },
    daysArray: function(messagesPerDay) {
        var daysArray = [];
        for (var day in messagesPerDay) {
            daysArray.push([parseInt(day), parseInt(messagesPerDay[day])]);
        }
        return daysArray;
    }

}