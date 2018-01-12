# Stomp-test
This repo serves as a test project for me to experiment with cosuming a live data stream from a RabbitMQ server. The goal is to connect to an API endpoint on that server using Stomp over Websocket and to convert that data into a suitable data structure which is in turn stored on a remote Mongodb.

The reasoning behind this is that I'm trying to upgrade the data connection of a research project. The project, called Biogasboot embodies a digester which can convert bio-waste from a restaurant in Amsterdam to biogas which can be used by that same restaurant to cook food.

My part in this is to set up an online dashboard which enables the wners of the restaurant to monitor the status of the fermentation system.
Currently, the sensors on the boat keeping track of things like the gas level, PH value of the bio material and power usage, log their info in CSV files. Those CSV files are inputted once a day into our Mongo database which is in turn read out by an online datavisualization application we custom made.
This method is cumbersome and wont allow for real-time tracking of the fermentation process which is why we decided to upgrade the system.

When I've concluded this test project, the Biogasboot data visualization system should work something like this:

1. Sensors on Biogasboot make measurements
2. PLC gathers the measurements
3. Raspberry Pi reads the measurements and publishes them to RabbitMQ server
4. RabbitMQ server publishes the data real-time to an API endpoint
5. InfluxDB listens to the endpoint and creates database with historic data
6. An application like `stomp-test` consumes the datastream using Stomp over Websocket
7. The data is processed and used to populate a remote MongoDB
8. Operators of the Biogasboot visit the datavisualization main page.
8. The datavisualization app requests real-time data from MongoDB and visualizes it.
9. Operators visit the historical data views.
10. The datavisualization app requests relevant time-series data from InfluxDb and visualizes it.