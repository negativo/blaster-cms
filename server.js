
// PERSONAL MODULES
// $F for methods require("./configs/functions")
// $S shared require("./configs/functions").shared;

var express = require("express"),
	app 	= express(),
	port 	= 9001,
	EventEmitter = require("events").EventEmitter,
		$ee = new EventEmitter(),
	config  = require("./configs/config")(app,$ee),
	publicRoutes = require("./routes/public-routes")(app,express),
	dashboardRoutes = require("./routes/dashboard-routes")(app,express),
	apiEndpoints = require("./routes/api-endpoints")(app,express),
	events = require("./configs/events")(app,$ee);



//FIRE IT UP
app.listen(port, function(){
	console.log("node on: " + port);
});	