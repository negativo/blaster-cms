module.exports = function(app){
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

	process.on('login_event',function(message){
		console.log(String(message).yellow);
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

	process.on("configs_updated",function(configs, message){
		app.set('configs_updated', Date.now() );
		console.log("configuration has been updated".cyan);
	});

	process.on("configs_parsed",function(configs, message){
		app.set('configs_parsed', Date.now() );
		console.log("Configurations parsed in request".cyan);
	});

	process.on("admin_setup",function(){
		console.log("admin setup done!".inverse.yellow);
	});

	process.on("post_setup",function(){
		console.log("post setup done!".inverse.yellow);
	});

	process.on("page_setup",function(){
		console.log("page setup done!".inverse.yellow);
	});
	
	process.on("setup_done",function(){
		console.log("Setup done!".green);
	});

	process.on('server_configured', function(){
		console.log("Server configurations: " + " LOADED!".inverse.green);
	});

}