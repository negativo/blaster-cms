
module.exports = function(app,express){
	var ruotesControllers = require("../controllers/public")(app),
		POST = ruotesControllers.POST,
		GET = ruotesControllers.GET;

	
	app.get("/", GET.homeCtrl );
	app.get("/page/:page", GET.singlePageCtrl );
	app.get("/post/:post", GET.singlePostCtrl );
	app.get("/404", GET.fourOfourCtrl );
	app.get("/search", GET.searchCtrl );
	app.get("/logout",function(req,res){
		req.logout();
		res.redirect("/");
	});

	app.post("/search", POST.searchCtrl );
}

