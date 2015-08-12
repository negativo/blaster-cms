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

	app.get("/admin/panel",function(req,res){
		res.render("panel");
	});

	//login with local
	app.get("/admin/login",function(req,res){
		res.render("login");
	});
	app.post("/admin/login", passport.authenticate('local'), function(req,res){
		console.log("routes.js", req.session);
		res.json({ err:undefined });
	});
	
	
	app.get("/page/:page", GET.pageCtrl );
	app.get("/post/:title", GET.postCtrl );
	app.get("/", GET.homeCtrl );


	//POSTs
	app.post("/install/mongo", POST.install.mongo);
	app.post("/install/cms", POST.install.cms);

	app.post("/create/post", POST.create.post);
	app.post("/create/page", POST.create.page);
}

