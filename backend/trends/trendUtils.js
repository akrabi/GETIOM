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
            var date = new Date(point.properties.time*1000);
            var day = date.toDateString();
            messagesPerDay[day] = messagesPerDay[day] ? messagesPerDay[day]+1 : 1;
        });
        return messagesPerDay;
    }
}