var $F = require("../configs/functions");
var passport = require("passport");

var ruotesControllers = require("../controllers/private-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

module.exports = function(app,express){

	//GETS
	app.get("/admin/login", GET.loginCtrl );
	app.get("/admin/panel", GET.dashboardCtrl );
	app.get("/admin/posts", GET.postsCtrl );


	//POSTS	
	//login local
	app.post("/admin/login", passport.authenticate('local'),  POST.loginCtrl );
	

}

