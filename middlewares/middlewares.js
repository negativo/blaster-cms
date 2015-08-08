var path = require("path");
var bodyParser = require("body-parser");
var install = require("../controllers/install");
var fs = require("fs");
var $S = require("../configs/functions").shared;
var $F = require("../configs/functions");
var __root = global.appRoot;


module.exports = function(app,express){
	//set static content folder	
	app.use( express.static(global.appRoot + "/public") );
	//global checks
	app.use(bodyParser());
	// attach shared object in al req
	app.use(function(req,res,next){
		req.shared = $S;
		next();
	});
	app.use(function(req,res,next){
		//if blog is installed load global configs
		fs.readFile(__root+"/bin/config.json","utf-8",function(err,file){
			console.log("middlewares.js", file.length);
			if(file.length > 0) { 
				var configs = JSON.parse(file);
				//console.log("middlewares.js", configs);
				$S = configs;
				console.log("middlewares.js", $S);
				next(); 
			}
			//if it's not installed install it.
			if(req.method === 'GET' && file.length <= 0) { res.render("install", $S )}
			next();
		});
		//check if user is logged
		//	tobedone
	});
}