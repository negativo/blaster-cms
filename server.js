
// PERSONAL MODULES
// $F for methods require("./configs/functions")
// $S shared require("./configs/functions").shared;

var express = require("express"),
	app 	= express(),
	port 	= 9001,
	EventEmitter = require("events").EventEmitter,
		$ee = new EventEmitter(),
	config  = require("./configs/config")(app,$ee),
	routes = require("./routes/routes")(app,express),
	events = require("./configs/events")(app,$ee);



//FIRE IT UP
app.listen(port, function(){
	console.log("node on: " + port);
});	