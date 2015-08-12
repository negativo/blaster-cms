var $F = require("../configs/functions");
var passport = require("passport");

var ruotesControllers = require("../controllers/api-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

module.exports = function(app,express){

	app.get("/get/posts", GET.allPostsCtrl );
	app.get("/get/pages", GET.allPagesCtrl );
	app.get("/get/configs", function(req,res,next){
		if(req.isAuthenticated()) next();
			else res.status(401).send("Unauthorized")
	},GET.configsCtrl );

}

