var $F = require("./functions");
var db = require("mongoose").connection;
var $S = $F.shared;

module.exports = function(app,$ee){
	// configuration object updated
	$ee.on("configs_updated",function(configs){
	});

	// configuration object updated
	$ee.on("mongo_global",function(message){
		console.log("events.js", "mongo_global");
	});

	// configuration file change event
	$ee.on("config_file_changed",function(message){
		console.log("events.js", message);
	})

	db.on("open",function(){
		console.log("events.js", "Mongo CONNECTED!");
		//console.log("Changing $S", $S)
	});

	db.on("close",function(){
		console.log("events.js", "Mongo DISCONNECTED!");
		//console.log("Changing $S", $S)
	});

}