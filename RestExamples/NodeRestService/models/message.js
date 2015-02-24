var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageSchema   = new Schema({
    coordinates: {"x": Number, "y": Number},
    city: String,
    time: Date,
    client: String,
    payload: String
});

module.exports = mongoose.model('Message', MessageSchema);

