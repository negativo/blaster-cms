var path = require("path");
var	dotenv  = require("dotenv").load(); 
var fs 		= require("fs");
var crypto  = require("../lib/crypto");

module.exports = function(app, express, $ee){
	var $utils = require("../lib/utils")(app);
	
	app.locals.debug_mode_on = process.env.DEBUG_MODE_ON;
	if (process.env.DEBUG_MODE_ON==="false") {
			//disable logging
	    console = console || {};
	    console.log = function(){};
	} else{
		var morgan = require("morgan");
	    app.use(morgan("dev"));
	};
	
	app.set("mongo_db",false);
	app.set("is_installed",false);

	var locals = app.locals;

	//set app route global
	locals.__baseurl = "http://127.0.0.1:" + locals.__port;
	locals.__theme = process.env.DEFAULT_THEME;
	locals.__configs = locals.__root + "/bin/config.json";


	app.set("view engine", "ejs");
	app.set("views", locals.__root + "/views/" + locals.__theme);


	fs.exists( locals.__configs , function(exists){
		if(!exists){
			fs.mkdirSync( locals.__root + "/bin");
			fs.writeFile( locals.__configs, "",function(err){
				if(err) console.log("config.js :37", err);
			});
		}
	});

	// *Get Configs on server start if cms is installed
	fs.readFile( locals.__configs ,"utf-8",function(err,file){
		if(typeof file !== 'undefined' && file.length > 0) { 
			var configs = JSON.parse(file);			
			$utils.connectDatabase(crypto.decrypt(configs.db_link),$ee);
		}
	});

	// MIDDLEWARES
	require( locals.__app + "/middlewares/middlewares")(app,express,$ee);
	
}
