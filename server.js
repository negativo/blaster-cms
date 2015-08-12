
// PERSONAL MODULES
// $F for methods require("./configs/functions")
// $S shared require("./configs/functions").shared;

var express = require("express"),
	app 	= express(),
	port 	= 9001,
	EventEmitter = require("events").EventEmitter,
		$ee = new EventEmitter(),
	events = require("./configs/events")(app,$ee),
	config  = require("./configs/config")(app,$ee,port),
	publicRoutes = require("./routes/public-routes")(app,express),
	privateRoutes = require("./routes/private-routes")(app,express),
	apiEndpoints = require("./routes/api-endpoints")(app,express);


//FIRE IT UP
app.listen(port, function(){
	console.log("node on: " + port);
});	