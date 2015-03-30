var Grid = function() {
    var geolib = require('geolib');
    return {
        cluster: function(data, params) {
            var sqrSize = params.sqrSize;
            var north, east, west, south;
            var width = geolib.getDistance(west, east);
            var height = geolib.getDistance(north, south);
            var size = Math.max(width, height);
            var squaresPerRow = Math.ceil(size/sqrSize)
            var gridSize = squaresPerRow*sqrSize;
            var numOfSquares = Math.pow(squaresPerRow, 2);
          //  var clusters[]; //clusters[numOfSquares];


        }
    }
}();

//function findWhichSquare(point, gridStart, sqrSize, numOfSquares) {
//    var i = geolib.getDistance([0, gridStart[1], [0, point[1]]) / sqrsize
//}
//module.exports = Grid;
