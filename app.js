'use strict';

const http = require('http');

var porta = process.env.PORT || 3000;

http.createServer((req, res) => {
	res.end('Testing Anyway..');
}).listen(porta, function(){
	console.log('Servidor iniciado na porta: ' + porta);
});