var $F = require("../configs/functions");
var passport = require("passport");

var ruotesControllers = require("../controllers/api-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;


module.exports = function(app,express){
	
	//add this middle to avoid curl request
	// own server request will be checked in controller
	var AreYouAuthorized = function(req,res,next){
		if(req.isAuthenticated()) next();
			else res.status(401).send("Unauthorized")
	}

	//PUBLIC ENDPOINTS
	app.get("/api/posts", GET.allPostsCtrl );
	app.get("/api/pages", GET.allPagesCtrl );
	
	//PRIVATE ENDPOINTSs
	app.get("/api/users", AreYouAuthorized , GET.usersCtrl );
	app.get("/api/configurations", AreYouAuthorized , GET.configsCtrl );

}

