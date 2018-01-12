/* jslint console:true, devel:true, eqeq:true, plusplus:true, sloppy:true, asi:true, vars: true, white:true, esversion:6 */
//TODO: implement middleware. Have a separate function that subscribes to endpoints
//		Call that function from the router using next?
// Separate this up into modules
// Create a Repo for this (but first add gitignore)
// Duplicate the models from the main biogasboot app and recreate the mongodb from that app using the new datastream

//Imports
const express = require('express')
const mongoose = require('mongoose')
const Stomp = require('@stomp/stompjs')
const moment = require('moment');	//TODO move this to the data creation module
require('dotenv').config();		//Secret info

//Settings and vars
const server = express();
const port = 3100;
const db = mongoose.connection;

const boatEndPoint = '/exchange/biogasboat'
const client = Stomp.client(process.env.SPECTRAL_DB_URL)

//Connect to Spectrals RabbitMQ to allow for a stomp socket connection
client.connect('web', 'mnwdTGgQu5zPmSrz', onConnect, console.error, '/')

//Connect to our MongoDB server which will host our version of the data
//The reason we need to do this is because we will geerate some new info derived from the raw data
mongoose.connect(process.env.MONGO_DB_URL);
mongoose.Promise = global.Promise	//Use the built in ES6 Promise

db.on('error', (err) =>{
	console.error('Uh oh: ', err.message)
})

// Import all data models
const EnergyConsumption = require('./models/EnergyConsumption')
const DataPoint = require('./models/dataPoint')
const StatusPoint = require('./models/statusPoint')

//Routes
server.get('/', (req, res) => {
	console.log("User routed to root")
	res.sendFile(__dirname + '/index.html')
})
server.get('/boat/:num', (req, res) => {
	console.log("User routed to boat requester, subscribing to ", req.params.num)
	client.subscribe('/exchange/power/'+req.params.num, onData)
	res.send('Requesting boat' + req.params.num)
})

//On connection with RabbitMQ, subscribe to a boats data
function onConnect(something){
	console.log('yaaaaay', something)
	client.subscribe(boatEndPoint, onData);
}

//When data is received, process it and store it in MongoDB
function onData(data){
	console.log("reeived data, will store in MongoDB")
	console.log(data.body)
	data = JSON.parse(data.body)
	const dataPoint = new DataPoint({
		Date: moment(`${data.Date} ${data.Time}`, 'DD/MM/YYYY HH:mm:ss').add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'),
		Temp_PT100_1: Number(data['Temp_PT100_1']),
		Temp_PT100_2: Number(data['Temp_PT100_2']),
		pH_Value: data['pH_Value'],
		Bag_Height: data['Bag_Height']
	})
	dataPoint
		.save()
		.then(dataPoint => {
			//console.log(dataPoint)
			return DataPoint.find()
		})
		.catch(err => {
			throw Error(err)
		})
	const statusPoint = new StatusPoint(data)
	//console.log(statusPoint)
	statusPoint.Date = moment(`${data.Date} ${data.Time}`, 'DD/MM/YYYY HH:mm:ss').add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'),
	statusPoint.Digester_Heater_1 = data['Digester_Heater_']
	statusPoint
		.save()
		.then(statusPoint => {
			//console.log(statusPoint)
			return StatusPoint.find()
		})
		.catch(err => {
			throw Error(err)
		})
}

//Listen for traffic on the specified port
server.listen(port, function(err){
	console.log(err || "Hi this is express, and I'm node, and you're listening to %s on ", process.env.npm_package_name, port);	
});