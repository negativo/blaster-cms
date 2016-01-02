var	dotenv = require("dotenv").load();
var fs 		  = require("fs");
var crypto = require("../lib/crypto");

module.exports = function(app, express, $ee){
	var locals = app.locals;
	var $utils = require("../lib/utils")(app);
	
	locals.debug_mode_on = process.env.DEBUG_MODE_ON;
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
	app.set('base_url',process.env.BASE_URL + ":" + locals.__port);
	app.set('theme',process.env.DEFAULT_THEME);
	app.set("view engine", "ejs");
	app.set("views", locals.__root + "/views/" + locals.__theme);

	locals.__configs = locals.__root + "/bin/config.json";

	/**
	 * CREATE CONFIG FILE IF DON'T EXISTS
	 */
	fs.exists( locals.__configs , function(exists){
		if(!exists){
			fs.mkdirSync( locals.__root + "/bin");
			fs.writeFile( locals.__configs, "",function(err){
				if(err) console.log("config.js :37", err);
			});
		}
	});

	/**
	 * GET CONFIGS IF INSTALLED AND CONNECT TO DB
	 */
	fs.readFile( locals.__configs ,"utf-8",function(err,file){
		if(typeof file !== 'undefined' && file.length > 0) { 
			var configs = JSON.parse(file);			
			$utils.connectDatabase(crypto.decrypt(configs.db_link),$ee);
		}
	});

	$ee.emit('server_configured');
}
