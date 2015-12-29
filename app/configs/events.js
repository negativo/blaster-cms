var colors = require('colors');
var db = require("mongoose").connection;

module.exports = function(app,$ee){
	// configuration object updated
	db.once("open",function(){
		app.set("mongo_db",true);
		console.log("events.js :8", "mongo connected".green);
	});

	db.on("close",function(){
		app.set("mongo_db",false);
		console.log("events.js :8", "mongo disconnected".yellow);
	});
	$ee.on("configs_updated",function(configs, message){
		console.log("events.js :8", "configuration changes".green);
		//global.theme = configs.theme;
		//console.log("events.js", message, configs );
	});

	// configuration object updated
	$ee.on("mongo_global",function(message){
		app.set("mongo_db",true);
		app.set("is_installed",true);
	});

	// configuration file change event
	$ee.on("config_file_changed",function(message){
		//console.log("events.js", message);
	});

	$ee.on("login_event",function(message){
		//console.log("events.js", message);
	});

	$ee.on('server_configured', function(){
		console.log("events.js :37", "server online".green);
	});

}