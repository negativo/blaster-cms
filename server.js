var express = require("express");
var app 	  = express();
var dotenv = require('dotenv').load();
var CMS 		= require('./app/init');

/**
 * GLOBALS
 */
app.locals.__root   = __dirname;
app.locals.__app    = __dirname + "/app";
app.locals.__public = __dirname + "/public";
app.locals.__views  = __dirname + "/themes";
app.locals.__admin  = __dirname + "/admin";
app.locals.__port   = process.env.SERVER_PORT;


/**
 * INIT CMS
 */
CMS.init(app,express);