var path = require("path");
var bodyParser = require("body-parser");
var fs = require("fs");
var __root = global.appRoot;
var $F = require("../configs/functions"),
	$S = $F.shared;
var Configs = require("../models/configs");


module.exports = function(app,express,$ee){
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
		console.log("middlewares.js is installed:", $F.isInstalled());
		if($F.isInstalled()) {
			//res.render("home", $S);
			Configs.findOne({},function(err,conf){
				req.shared = $S = conf;
			})
			next();
		} else {
			fs.readFile(__root+"/bin/config.json","utf-8",function(err,file){
				if(file.length > 0) { 
					$S = JSON.parse(file);
					$F.syncConfig($S);
					next(); 
				}
				//if it's not installed install it.
				if(req.method === 'GET' && file.length <= 0) { res.render("../install", $S )}
				next();
			});
		}

		//check if user is logged
		//	tobedone
	});
}