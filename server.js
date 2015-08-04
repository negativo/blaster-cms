var express = require("express"),
	app 	= express(),
	port 	= 9001,
	config  = require("./configs/config")(app),
	fs 		= require("fs");

// get routes
var routes = require("./routes/routes")(app,express);

app.listen(port, function(){
	console.log("node on: " + port);
});