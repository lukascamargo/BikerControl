
// Declarando variaveis do ThingSpeak
var ThingSpeakClient = require('thingspeakclient');
var client = new ThingSpeakClient({server: 'https://api.thingspeak.com/channels/278706/feeds.json?api_key=OA6Z8S0GI3CLF3BY&results=2%20api.thingspeak.com%20{%22channel%22:{%22id%22:278706,%22name%22:%22Bicicleta%22,%22description%22:%22PI%20V%22,%22latitude%22:%220.0%22,%22longitude%22:%220.0%22,%22field1%22:%22Velocidade%22,%22created_at%22:%222017-05-27T12:52:03Z%22,%22updated_at%22:%222017-05-27T12:52:03Z%22,%22last_entry_id%22:null},%22feeds%22:[]}%20api.thingspeak.com'});
var channelID = 278706;
var yourWriteKey = 'W3Z1F80C4MF7F4QP';
var readKeyApi = 'OA6Z8S0GI3CLF3BY';
var url = 'https://api.thingspeak.com/channels/278706/feeds.json';


var path = require('path');
var consign = require('consign');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var request = require('request');
var io = require('socket.io').listen(server);
var porta = process.env.PORT || 8080;

//Declarando e importando o Banco de Dados
require('./config/database')('mongodb://bikercontrol:123Mudar@ds057254.mlab.com:57254/heroku_vmv3brb0');
consign({cwd: 'app'})
    .include('models')
    .into(app);
var mongoose = require('mongoose');
var model = mongoose.model('Bike');

//Função que inicia o socket.io
io.on('connection', function(socket){
    console.log('socket open');
});

//v = data * 0.0144;
var parametro = {};
var bikeData = {};
/*parametro.nome = 'Bike 1';
parametro.x = '0.4';
parametro.y = '13213';*/

/*
io.sockets.on('connection', function(socket){
    console.log('Client ' + socket.id + ' is connected');

    socket.on('ready', function(){
        parametro = getData();
        socket.emit('port', bike.field1 * 0.0144);
    });

    socket.on('disconnect', function(){
        console.log('Cliente ' + socket.id + ' desconectado');
    })
})*/

setInterval(function(){

    request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
           parametro = JSON.parse(body);
           bike = parametro.feeds[parametro.feeds.length - 1];

           io.sockets.emit('port', bike.field1 * 0.0144);

           
           model
                .findById('592b720cfe5cf11c9c42ecf4')
                    .select('velocidade')
                        .then(function(resultado){
                            resultado.velocidade.push({
                                velocidade : bike.field1 * 0.0144,
                                time : bike.created_at
                            });
                            resultado.save(function(err, result){
                                var thisEdit;
                                if(err){
                                    console.log('Deu erro pra salvar velocidade');
                                } else {
                                    console.log('Velocidade atualizada para Bike 1. Indice: ');
                                    thisEdit = resultado.velocidade[resultado.velocidade.length - 1];
                                    console.log(resultado.velocidade.length);
                                }
                            });
                        }, function(error){
                            console.log('Deu erro');
                            console.log(error);
                        });

            model
                .findById('592b77ffb2a259231017c27b')
                    .select('velocidade')
                        .then(function(resultado){
                            resultado.velocidade.push({
                                velocidade : bike.field2 * 0.0144,
                                time : bike.created_at
                            });
                            resultado.save(function(err, result){
                                var thisEdit;
                                if(err){
                                    console.log('Deu erro pra salvar velocidade');
                                } else {
                                    console.log('Velocidade atualizada para Bike 2. Indice: ');
                                    thisEdit = resultado.velocidade[resultado.velocidade.length - 1];
                                    console.log(resultado.velocidade.length);
                                }
                            });
                        }, function(error){
                            console.log('Deu erro');
                            console.log(error);
                        });
        }

        return bike;
    });

}, 10000);







app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));

});


app.get('/getData/', function(req, res){
    model
        .find()
            .then(function(resultado){
                console.log('Entregando resultado...');
                
                var velocidade = resultado[2].velocidade;
                var index = velocidade.length - 1
                var objeto = [{nome: resultado[2].nome, velocidade: resultado[2].velocidade[index].velocidade},
                            {nome: resultado[3].nome, velocidade: resultado[3].velocidade[resultado[3].velocidade.length - 1].velocidade}];

                res.json(objeto);
                res.status(200);
            }, function(error){
                res.json({erro: 'Deu erro,carai'});
                res.sendStatus(404)
            })
})


server.listen(process.env.PORT || 8080, function(){
	console.log('Servidor escutando na porta '+porta);
});