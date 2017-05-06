var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var porta = 8080;


var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var port = new SerialPort("COM5", {
	baudrate: 9600,
	parser: serialport.parsers.readline("\n")
});

io.on('connection', function(socket){
	console.log('socket open');
});

port.on('open', onOpen);
port.on('data', onData);

function onOpen(){
	console.log('Sistema conectado com o Arduino');
};

function onData(data){
	v = data * 0.0144;
	io.sockets.emit('port', v);
	console.log('Velocidade: ' + v);
}


app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));

});

server.listen(porta, function(){
	console.log('Servidor escutando na porta '+porta);
});