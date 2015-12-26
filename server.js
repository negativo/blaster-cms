var express       = require("express"),
port 	            = 8181,
app 	            = express();


//globals
app.locals.__root = __dirname;
app.locals.__app  = __dirname + "/app";
app.locals.__port = port;

var EE 		 = require("events").EventEmitter,
$ee        = new EE(),
events     = require(app.locals.__app + "/configs/events")(app,$ee),
config     = require(app.locals.__app + "/configs/config")(app, express, $ee),

//ROUTES
public_routes  = require(app.locals.__app + "/routes/public")(app,express),
private_routes = require(app.locals.__app + "/routes/private")(app,express),
api_routes     = require(app.locals.__app + "/routes/api")(app,express);



//ERROR
process.on("uncaughtException", function(err){
	console.log("server.js :18", err);
});

process.on("exit", function(err){
	console.log("server.js :27", "GOODBYE");
});

//FIRE IT UP
app.listen(app.locals.__port, function(){
	console.log("fire it up on port: " + app.locals.__port);
});	
