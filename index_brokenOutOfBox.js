/* jslint console:true, devel:true, eqeq:true, plusplus:true, sloppy:true, vars: true, white:true, esversion:5 */

const express = require('express')
const http = require('http')	//swap for debug?

const Stomp = require('./stomp.js').Stomp
const WebSocket = require('ws')

// const server = express();
// //Set the port the app will run on
// const port = 3100;

// server.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

// console.log("Raising Server from the dead");

// server.listen(port, function(err){
// 	console.log(err || "Hi this is express, and I'm node, and you're listening to %s on ", process.env.npm_package_name, port);	
// });

const ws = new WebSocket('ws://stomp.spectral.energy:15674/ws')
//const client = Stomp.over('ws://stomp.spectral.energy:15674/ws') //Maakt een klein client object aan maar connect gooit geen error of result
const client = Stomp.over(ws) //Maakt een groter client object aan maar client.connect gooit 'Stomp.setInterval is not a function'

console.log("attempting to connect as web user", client)
client.connect('web', 'mnwdTGgQu5zPmSrz', onConnect, console.error, '/')

function onConnect(something){
	console.log('yaaaaay', something)
}





