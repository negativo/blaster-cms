var express = require("express");
var path = require("path");
var	dotenv  = require("dotenv").load(); 
var fs 		= require("fs");

module.exports = function(app){
	//set app route global
	global.appRoot = path.resolve(__dirname,"../");
	
	app.set("view engine", "ejs");

	//load middleware ./middlewares/middlewares
	require(global.appRoot + "/middlewares/middlewares")(app,express);
	
}