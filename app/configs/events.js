module.exports = function(app,$ee){
	var db = require("mongoose").connection;
	var colors = require("colors");


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

	process.on('media_removed',function(){
		console.log("media has been removed".yellow);
	});

	process.on('post_removed',function(){
		console.log("post has been removed".yellow);
	});

	process.on('page_removed',function(){
		console.log("page has been removed".yellow);
	});

	process.on('user_removed',function(){
		console.log("user has been removed".yellow);
	});

	process.on('comment_removed',function(){
		console.log("comment has been removed".yellow);
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