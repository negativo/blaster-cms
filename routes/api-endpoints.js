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

	//POSTs
	app.post("/install/mongo", POST.install.mongo);
	app.post("/install/cms", POST.install.cms);

	app.post("/create/post", POST.create.post);
	app.post("/create/page", POST.create.page);


}

