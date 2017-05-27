var mongoose = require('mongoose');
Schema = mongoose.Schema;

var bikeSchema = new mongoose.Schema({
	nome: String,
    velocidade: [{time: String, velocidade: String}]
});


module.exports = mongoose.model('Bike', bikeSchema);