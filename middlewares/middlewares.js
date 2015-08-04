var path = require("path");
var bodyParser = require("body-parser");

module.exports = function(app,express){
	//check if installed if not redirect
	//set static content folder
	app.use( express.static(global.appRoot + "/public") );
	app.use(bodyParser());

	// app.use(function(req,res,next){
	// 	if (!require("../controllers/install").isInstalled()) {
	// 		res.render("install", {
	// 			title: process.env.BLOG_NAME + " - Installation"
	// 		});	
	// 	}
	// 	next();
	// });
}