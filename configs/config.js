var express = require("express");
var path = require("path");
var	dotenv  = require("dotenv").load(); 
var fs 		= require("fs");
var crypto  = require("../library/crypto");
var $F = require("../configs/functions"),
	$S = $F.shared;

module.exports = function(app,$ee){
	//DEBUG
	////disable console.log()
	if (process.env.DEBUG_MODE_ON==="false") {
	    console = console || {};
	    console.log = function(){};
	} else{
		var morgan = require("morgan");
	    app.use(morgan("dev"));
	}

	//set app route global
	__root = global.appRoot = path.resolve(__dirname,"../");

	app.set("views", __root + "/views/template");
	app.set("partials", __root + "/views/template/partials");
	app.set("view engine", "ejs");

	require("./routines")($ee);

	//GLOBAL DB CONNECTION&REFRESH
	fs.readFile(__root+"/bin/config.json","utf-8",function(err,file){
		if(file.length > 0) { 
			var configs = JSON.parse(file);
			$F.syncConfig(configs,$ee);
			$F.connectDatabase(crypto.decrypt(configs.db_link),$ee);
		}
	});


	// MIDDLEWARES
	require(global.appRoot + "/middlewares/middlewares")(app,express,$ee);
	
}

