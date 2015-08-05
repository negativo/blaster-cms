var path = require("path");
var bodyParser = require("body-parser");
var install = require("../controllers/install");

module.exports = function(app,express){
	//check if installed if not redirect
	//set static content folder
	app.use( express.static(global.appRoot + "/public") );
	app.use(bodyParser());

	//check if blog is installed
	app.use(function(req,res,next){

		install
			.isInstalled()
			.then(function(blogIsInstalled){
				if (blogIsInstalled) next();
				else{
					res.redirect("/install");
				}
			});

		next();
	});
}