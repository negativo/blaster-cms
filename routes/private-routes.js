var $F = require("../configs/functions");
var passport = require("passport");

var ruotesControllers = require("../controllers/private-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

module.exports = function(app,express){

	//GETS
	app.get("/admin/login", GET.loginPageCtrl );
	//DISPLAY
	app.get("/admin/panel", GET.dashboardPageCtrl );
	app.get("/admin/posts", GET.postsPageCtrl );
	app.get("/admin/pages", GET.pagesPageCtrl );
	app.get("/admin/users", GET.usersPageCtrl );
	app.get("/admin/configurations", GET.configurationsPageCtrl );

	//CRUD
	app.get("/admin/create-post", GET.createPostCtrl );
	app.get("/admin/create-page", GET.createPageCtrl );
	app.get("/admin/edit-page/:id", GET.editSinglePage );



	//POSTS	
	//login local
	app.post("/admin/login", passport.authenticate('local'),  POST.loginCtrl );
	app.post("/admin/edit-page", POST.editSinglePage );
	

}

