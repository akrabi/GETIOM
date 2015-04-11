module.exports = {
    average: function (array) {
        var sum = array.reduce(function (sum, val) {
            return sum + val;
        }, 0);

        var avg = sum / array.length;
        return avg;
    },
    findPointsPerDay: function(cluster) {
        var pointsPerDay = {};
        cluster.forEach(function(point) {
            var day = Math.floor(point.properties.time/86400)*86400000; // Convert unix timestamp to day in miliseconds
            pointsPerDay[day] = pointsPerDay[day] ? pointsPerDay[day]+1 : 1;
        });
        return pointsPerDay;
    },
    daysArray: function(pointsPerDay) {
        var daysArray = [];
        for (var day in pointsPerDay) {
            daysArray.push([parseInt(day), parseInt(pointsPerDay[day])]);
        }
        return daysArray.sort(function(day1, day2) {
            return day1[0] - day2[0];
        });
    }

}