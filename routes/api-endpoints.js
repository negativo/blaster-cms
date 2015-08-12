var $F = require("../configs/functions");
var passport = require("passport");

var ruotesControllers = require("../controllers/api-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;


module.exports = function(app,express){
	
	// NEED TO IMPLEMENT API TOKEN BUT NOT NEEDED NOW
	var AreYouAuthorized = function(req,res,next){
		if(req.isAuthenticated()) next();
			else res.status(401).send("Unauthorized")
	}

	
	app.get("/api/posts", AreYouAuthorized, GET.allPostsCtrl );
	app.get("/api/pages", AreYouAuthorized, GET.allPagesCtrl );
	app.get("/api/users", AreYouAuthorized , GET.usersCtrl );
	app.get("/api/configurations", AreYouAuthorized , GET.configsCtrl );

}

