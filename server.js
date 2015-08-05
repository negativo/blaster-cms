var express = require("express"),
	app 	= express(),
	port 	= 9001,
	config  = require("./configs/config")(app),
	fs 		= require("fs"),
	dotenv  = require("dotenv").load(),
	install = require("./controllers/install");

// get routes
var routes = require("./routes/routes")(app,express);

//set default name of website
// process.env.BLOG_NAME = process.env.blog.
console.log(process.env)

app.listen(port, function(){
	console.log("node on: " + port);
});