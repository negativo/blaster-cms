var express = require("express");
var path = require("path");
var dotenv = require("dotenv").load();

module.exports = function(app){

	app.set("view engine", "ejs");

	//set app route global
	global.appRoot = path.resolve(__dirname,"../");
	
	//load middleware ./middlewares/middlewares
	require(global.appRoot + "/middlewares/middlewares")(app,express);

}