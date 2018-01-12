const mongoose = require('mongoose')
mongoose.Promise = global.Promise	//Use the built in ES6 Promise

const energyConsumptionSchema = new mongoose.Schema({
	consumption: {
		type: Number
	},
	heatPump: {
		type: Number
	},
	mainBreaker: [Number]
})

module.exports = mongoose.model('EnergyConsumption', energyConsumptionSchema)
