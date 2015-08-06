var express = require("express"),
	app 	= express(),
	port 	= 9001,
	config  = require("./configs/config")(app),
	fs 		= require("fs"),
	install = require("./controllers/install")
	routes = require("./routes/routes")(app,express);

//disable console.log()
 	

if (process.env.DEBUG_MODE_ON==="false") {
    console = console || {};
    console.log = function(){};
}


app.listen(port, function(){
	console.log("node on: " + port);
});	

