module.exports = function(app,$ee){
	var db = require("mongoose").connection;
	var colors = require("colors");
	var $utils = require('../lib/utils')(app);

	// configuration object updated
	db.once("open",function(){
		console.log("mongo connected".green);
	});

	db.on("error",function(info){
		console.log("mongo error".red, info);
		process.exit();
	});

	db.on("close",function(){
		console.log("mongo disconnected".yellow);
	});



	$ee.on("configs_updated",function(configs, message){
		app.set('configs_updated', Date.now() );
		console.log("configuration has been updated".cyan);
	});

	$ee.on("configs_parsed",function(configs, message){
		app.set('configs_parsed', Date.now() );
		console.log("Configurations parsed in request".cyan);
	});


	$ee.on('server_configured', function(){
		console.log("Server configurations done!".inverse.green);
	});

}