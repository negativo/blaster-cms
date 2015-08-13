var $F = require("./functions");
var db = require("mongoose").connection;

module.exports = function(app,$ee){
	// configuration object updated
	db.once("open",function(){
		console.log("events.js", "Mongo checkConnection() returned true");
		app.set("mongo_db",true);
	});

	db.on("close",function(){
		console.log("events.js", "Mongo DISCONNECTED!");
		app.set("mongo_db",false);
	});
	$ee.on("configs_updated",function(configs, message){
		global.theme = configs.theme;
		console.log("events.js", message, configs );
	});

	// configuration object updated
	$ee.on("mongo_global",function(message){
		console.log("events.js", "mongo_global");
		app.set("mongo_db",true);
	});

	// configuration file change event
	$ee.on("config_file_changed",function(message){
		console.log("events.js", message);
	});

	$ee.on("login_event",function(message){
		console.log("events.js", message);
	});


}