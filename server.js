var express       = require("express"),
port 	            = 8181,
app 	            = express();
app.locals.__root = __dirname;
app.locals.__app  = __dirname + "/app";
app.locals.__port  = port;

var EE 			      = require("events").EventEmitter,
$ee               = new EE(),
events            = require(app.locals.__app + "/configs/events")(app,$ee),
config            = require(app.locals.__app + "/configs/config")(app, express, $ee),
publicRoutes      = require(app.locals.__app + "/routes/public-routes")(app,express),
privateRoutes     = require(app.locals.__app + "/routes/private-routes")(app,express),
apiEndpoints      = require(app.locals.__app + "/routes/api-endpoints")(app,express);

process.on("uncaughtException", function(err){
	console.log("server.js :18", err);
});

//FIRE IT UP
app.listen(app.locals.__port, function(){
	console.log("fire it up on port: " + app.locals.__port);
});	