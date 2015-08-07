var path = require("path");
var bodyParser = require("body-parser");
var install = require("../controllers/install");
var fs = require("fs");
var shared = require("../configs/functions").shared;


module.exports = function(app,express){
	//set static content folder	
	app.use( express.static(global.appRoot + "/public") );
	app.use(bodyParser());
	// attach shared object in al req
	app.use(function(req,res,next){
		req.shared = shared;
		next();
	});
	//global checks
	app.use(function(req,res,next){
		//check if blog is installed if not redirect on installation
		if(req.method === 'GET' && !shared.isInstalled) { res.render("install", shared )}
		//check if user is logged
		//	tobedone
		next();
	});
}