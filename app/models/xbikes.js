var mongoose = require('mongoose');
Schema = mongoose.Schema;

var bikeSchema = new mongoose.Schema({
	nome: String,
    y: String,
    x: String
});


module.exports = mongoose.model('Bike', bikeSchema);