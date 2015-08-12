var $F = require("../configs/functions");
	$S = $F.shared;
var passport = require("passport");

var ruotesControllers = require("../controllers/privateRequest"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

module.exports = function(app,express){

	app.get("/admin/panel", GET.dashboardCtrl );

	//login with local
	app.get("/admin/login", GET.loginCtrl );
	app.post("/admin/login", passport.authenticate('local'),  POST.loginCtrl );
	

}

