module.exports = function(app,$ee){
	var db = require("mongoose").connection;
	var colors = require("colors");
	var $utils = require('../lib/utils')(app);

	// configuration object updated
	db.once("open",function(){
		$utils.isInstalled();
		app.set("mongo_db",true);
		console.log("mongo connected".green);
	});

	db.on("error",function(info){
		console.log("mongo error".red, info);
		process.exit();
	});

	db.on("close",function(){
		app.set("mongo_db",false);
		console.log("mongo disconnected".yellow);
	});



	$ee.on("configs_updated",function(configs, message){
		console.log("events.js :8", "configuration parsed".green);
		//global.theme = configs.theme;
		//console.log("events.js", message, configs );
	});


	$ee.on('server_configured', function(){
		console.log("events.js :37", "server configured".green);
	});

}