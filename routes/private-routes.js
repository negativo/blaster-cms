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
	app.get("/admin/users/:id", GET.profileCtrl );
	app.get("/admin/configurations", GET.configurationsPageCtrl );

	//CRUD
	app.get("/admin/new-post", GET.newPostCtrl );
	app.get("/admin/new-page", GET.newPageCtrl );
	app.get("/admin/edit-nav", GET.editNavigation );
	app.get("/admin/edit-post/:id", GET.editSinglePost );
	app.get("/admin/edit-page/:id", GET.editSinglePage );



	//POSTS	
	//login local
	app.post("/admin/login", passport.authenticate('local'),  POST.loginCtrl );
	app.post("/admin/edit-post", POST.editSinglePost );
	app.post("/admin/edit-page", POST.editSinglePage );
	app.post("/admin/edit-nav", POST.editNavigation );
	app.post("/admin/edit-configurations", POST.editConfigurations );
	

}

