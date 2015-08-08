var path = require("path");
var bodyParser = require("body-parser");
var install = require("../controllers/install");
var fs = require("fs");
var $S = require("../configs/functions").shared;
var $F = require("../configs/functions");


module.exports = function(app,express){
	//set static content folder	
	app.use( express.static(global.appRoot + "/public") );
	//global checks
	app.use(function(req,res,next){
		//check if blog exists and connect to db to retrieves globals
		//check if blog is installed if not redirect on installation
		if(req.method === 'GET' && !$S.isInstalled) { res.render("install", $S )}
		//check if user is logged
		//	tobedone
		next();
	});
	app.use(bodyParser());
	// attach shared object in al req
	app.use(function(req,res,next){
		req.shared = $S;
		next();
	});
}