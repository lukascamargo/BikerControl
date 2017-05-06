var porta = 5000;
var io = require('socket.io').listen(porta);

io.sockets.on('connection', function(socket){
	console.log('Socket ouvindo na porta ' + porta);
});