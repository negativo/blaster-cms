var path = require("path");
//blog installation process
isBlogInstalled = Boolean;
require("../controllers/install.js")(function(installed){
	//check if installed or not boolean
	isBlogInstalled = installed;
});

module.exports = function(app,express){



	//set static content folder
	app.use( express.static(global.appRoot + "/public") );

	//INSTALLER if it's not installed go to installation process
	app.use(function(req,res,next){
		// console.log(isBlogInstalled)
		if (!isBlogInstalled) res.render("install.ejs")
		next();
	})
	
}