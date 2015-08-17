var $F = require("../configs/functions");
var passport = require("passport");

var ruotesControllers = require("../controllers/public-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

var api = require("../controllers/api-request.js");

module.exports = function(app,express){

	//GETs
	app.get("/404",function(req,res){
		var data =  $F.dataParser(req.shared),
		navigation =  $F.dataParser(req.navigation);
		res.render( "404" , { viewData: data, navigation: navigation })
	});
	
	app.get("/", GET.homeCtrl );
	//app.get("/:page", GET.singlePageCtrl );
	app.get("/page/:page", GET.singlePageCtrl );
	app.get("/post/:post", GET.singlePostCtrl );
	
	app.get("/get/posts", GET.allPostsCtrl );
	app.get("/get/pages", GET.allPagesCtrl );

	app.get("/logout",function(req,res){
		req.logout();
		res.redirect("/");
	})

	// //POSTs
	// app.post("/install/mongo", POST.install.mongo);
	// app.post("/install/cms", POST.install.cms);

	// app.post("/create/post", api.POST.create.post);
	// app.post("/create/page", api.POST.create.page);
}

