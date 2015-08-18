var $F = require("../configs/functions");
var passport = require("passport");

var ruotesControllers = require("../controllers/public-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

//var api = require("../controllers/api-request.js");
module.exports = function(app,express){
	//GETs
	app.get("/", GET.homeCtrl );
	app.get("/page/:page", GET.singlePageCtrl );
	app.get("/post/:post", GET.singlePostCtrl );
	app.get("/404", GET.fourOfourCtrl );
	app.get("/logout",function(req,res){
		req.logout();
		res.redirect("/");
	});

}

