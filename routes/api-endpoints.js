var $F = require("../configs/functions");
var passport = require("passport");

var ruotesControllers = require("../controllers/api-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;


module.exports = function(app,express){
	
	var AreYouAuthorized = function(req,res,next){
		if(req.isAuthenticated()) next();
			else res.status(401).send("Unauthorized")
	}

	//PUBLIC ENDPOINTS
	app.get("/get/posts", GET.allPostsCtrl );
	app.get("/get/pages", GET.allPagesCtrl );
	
	//PRIVATE ENDPOINTSs
	app.get("/get/users", AreYouAuthorized , GET.usersCtrl );
	app.get("/get/configurations", AreYouAuthorized , GET.configsCtrl );

}

