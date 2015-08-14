var $F = require("../configs/functions");
var passport = require("passport");

var ruotesControllers = require("../controllers/public-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

module.exports = function(app,express){

	//GETs

	app.get("/404",function(req,res){
		res.send("404");
	});
	
	
	app.get("/", GET.homeCtrl );
	app.get("/:page", GET.singlePageCtrl );
	//app.get("/page/:page", GET.singlePageCtrl );
	app.get("/post/:title", GET.singlePostCtrl );
	app.get("/get/posts", GET.allPostsCtrl );
	app.get("/get/pages", GET.allPagesCtrl );


	//POSTs
	app.post("/install/mongo", POST.install.mongo);
	app.post("/install/cms", POST.install.cms);

	app.post("/create/post", POST.create.post);
	app.post("/create/page", POST.create.page);
}

