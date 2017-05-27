var client = require('thingspeakclient');
var client = new ThingSpeakClient();
var channelID = 278706;
var yourWriteKey = 'W3Z1F80C4MF7F4QP';
var path = require('path');
var consign = require('consign');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var porta = 8080;
var serialport = require('serialport'),
    plotly = require('plotly')('lukasfialho','pas1yJ1jmh7eGrmu5KeR'),
    token = '3bv66snptn';
var stream = function(){};

require('./config/database')('mongodb://bikercontrol:123Mudar@ds057254.mlab.com:57254/heroku_vmv3brb0');

consign({cwd: 'app'})
    .include('models')
    .into(app);

var mongoose = require('mongoose');
var model = mongoose.model('Bike');

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var port = new SerialPort("COM5", {
	baudrate: 9600,
	parser: serialport.parsers.readline("\n")
});

io.on('connection', function(socket){
	console.log('socket open');
});

var initdata = [{x:[], y:[], stream:{token:token, maxpoints: 500}}];
var initlayout = {fileopt : "extend", filename : "BikerControl"};

function getDateString() {
    var time = new Date().getTime();
    // 32400000 is (GMT+9 Japan)
    // for your timezone just multiply +/-GMT by 36000000
    var datestr = new Date(time +32400000).toISOString().replace(/T/, ' ').replace(/Z/, '');
    return datestr;
}


port.on('open', onOpen);

plotly.plot(initdata, initlayout, function (err, msg) {
	if (err) return console.log(err)

    console.log(msg);
    stream = plotly.stream(token, function (err, res) {
        console.log(err, res);
    });

	port.on('data', onData);

});

function onOpen(){
	console.log('Sistema conectado com o Arduino');
};

function onData(data){
	v = data * 0.0144;
	io.sockets.emit('port', v);
	console.log('Velocidade: ' + v);

	if(isNaN(v) || v > 1023) return;

    var streamObject = JSON.stringify({ x : getDateString(), y : v });
    stream.write(streamObject+'\n');

    var parametro = {};
    parametro.nome = 'Bike 1';
    parametro.x = '0.4';
    parametro.y = '13213';

    model.create(parametro)
        .then(function(retorno){
            console.log('Passando velocidade ' + retorno.x + ' para o banco de dados');
        }, function(error){
            console.log(error);
        });
}


app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + 'public/index.html'));

});

server.listen(porta, function(){
	console.log('Servidor escutando na porta '+porta);
});