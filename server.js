var OS      = require('os');
var cluster = require("cluster");
var express = require("express");
var app 	  = express();
var dotenv  = require('dotenv').load();
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
app.set("workers", 1);


if(process.env.DEBUG_MODE_ON == 'false'){
	if (cluster.isMaster) {
	  for (var i = 0; i < OS.cpus().length; i++) {
	    cluster.fork(); // create a worker
	  }
	 
	  cluster.on("exit", function(worker, code) {
      if (code != 0) {
          console.log("Worker crashed! Spawning a replacement.");
          cluster.fork();
      }
	  });
	} else {
		/**
		 * INIT A CMS's WORKER
		 */
		
		console.log("# Worker Spawned #");
		CMS.init(app,express);
	}
}else{
	console.log("# Worker Spawned #");
	CMS.init(app,express);
}


 