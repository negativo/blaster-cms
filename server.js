var express = require("express"),
	app 	= express(),
	port 	= 9001,
	config  = require("./configs/config")(app),
	routes = require("./routes/routes")(app,express),
	install = require("./controllers/install");


	config

app.listen(port, function(){
	console.log("node on: " + port);
});	

