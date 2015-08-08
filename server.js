
// PERSONAL MODULES
// $F for methods require("./configs/functions")
// $S shared require("./configs/functions").shared;

var express = require("express"),
	app 	= express(),
	port 	= 9001,
	config  = require("./configs/config")(app),
	routes = require("./routes/routes")(app,express),
	install = require("./controllers/install");

var $S = require("./configs/functions");


app.listen(port, function(){
	console.log("node on: " + port);
});	