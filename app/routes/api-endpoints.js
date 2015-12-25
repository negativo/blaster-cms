module.exports = function(app,express){
	
	var ruotesControllers = require("../controllers/api-request")(app),
	POST                  = ruotesControllers.POST,
	GET                   = ruotesControllers.GET;
	
	// NEED TO IMPLEMENT API TOKEN BUT NOT NEEDED NOW
	var AreYouAuthorized = function(req,res,next){
		if(req.isAuthenticated()) next();
			else res.status(401).send("Unauthorized")
	}

	app.get("/api/posts", GET.allPostsCtrl );
	app.get("/api/pages", GET.allPagesCtrl );
	// app.get("/api/users" , GET.usersCtrl );
	// app.get("/api/configurations" , GET.configsCtrl );

	//POSTs
	app.post("/install/mongo", POST.install.mongo);
	app.post("/install/cms", POST.install.cms);

	app.post("/create/post", POST.create.post);
	app.post("/create/page", POST.create.page);
	app.post("/create/comment/", POST.create.comment);
	app.post("/create/reply/", POST.create.reply);
	app.post("/api/search", POST.searchCtrl );


}
