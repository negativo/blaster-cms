var $F = require("../configs/functions");
	$S = $F.shared;
var passport = require("passport");

var ruotesControllers = require("../controllers/requests"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

module.exports = function(app,express){

	//GETs

	app.get("/404",function(req,res){
		res.send("404");
	});

	app.get("/admin/panel", GET.dashboardCtrl );

	//login with local
	app.get("/admin/login", GET.loginCtrl );
	app.post("/admin/login", passport.authenticate('local'),  POST.loginCtrl );
	
	
	app.get("/page/:page", GET.pageCtrl );
	app.get("/post/:title", GET.postCtrl );
	app.get("/", GET.homeCtrl );


	//POSTs
	app.post("/install/mongo", POST.install.mongo);
	app.post("/install/cms", POST.install.cms);

	app.post("/create/post", POST.create.post);
	app.post("/create/page", POST.create.page);
}

