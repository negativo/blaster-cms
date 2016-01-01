var express = require("express"),
port 	      = 8181,
app 	      = express(),
EE 		      = require("events").EventEmitter,
$ee         = new EE();


/**
 * GLOBALS
 */
app.locals.__root   = __dirname;
app.locals.__app    = __dirname + "/app";
app.locals.__public = __dirname + "/public";
app.locals.__views  = __dirname + "/views";
app.locals.__admin  = __dirname + "/admin";
app.locals.__port   = port;

/**
 * CONFIG & STARTUPS
 */
require(app.locals.__app + "/configs/config")(app, express, $ee);

/**
 * EVENTS
 */
require(app.locals.__app + "/configs/events")(app,$ee);

/**
 * MIDDLEWARES
 */
require( app.locals.__app + "/middlewares/middlewares")(app,express,$ee);

/**
 * ROUTES
 */
require(app.locals.__app + "/routes/public")(app,express), 	// Public
require(app.locals.__app + "/routes/private")(app,express),	// Private
require(app.locals.__app + "/routes/api")(app,express);			// API

/**
 * Exceptions
 */
process.on("uncaughtException", function(err){
	console.log("server.js :18", err.message);
});

/**
 * on process exit handler
 */
process.on("exit", function(err){
	console.log("server.js :27", "GOODBYE");
});

/**
 * SERVER
 */
app.listen(app.locals.__port, function(){
	console.log("fire it up on port: " + app.locals.__port);
});	
