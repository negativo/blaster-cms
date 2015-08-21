var $F = require("../configs/functions");
var passport = require("passport");

var multer = require("multer"),
	uploader = multer({ dest: './uploads/' }),
	avatar = multer({ dest: global.appRoot + "/uploads/user"});


var ruotesControllers = require("../controllers/private-request"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

module.exports = function(app,express){

	//GETS
	app.get("/admin/login", GET.loginPageCtrl );
	app.get("/admin/new-user", GET.newUserCtrl );
	app.get("/admin/register", GET.registerCtrl );
	//DISPLAY
	app.get("/admin/panel", GET.dashboardPageCtrl );
	app.get("/admin/posts", GET.postsPageCtrl );
	app.get("/admin/pages", GET.pagesPageCtrl );
	app.get("/admin/comments", GET.commentsPageCtrl );
	app.get("/admin/users", GET.usersPageCtrl );
	app.get("/admin/users/:id", GET.profileCtrl );
	app.get("/admin/configurations", GET.configurationsPageCtrl );

	//VIEW WITH CRUD OPs
	// 	CREATE/EDIT
	app.get("/admin/new-post", GET.newPostCtrl );
	app.get("/admin/new-page", GET.newPageCtrl );
	app.get("/admin/edit-nav", GET.editNavigation );
	app.get("/admin/edit-theme", GET.editTheme );
	app.get("/admin/themes", GET.themesCtrl );
	app.get("/admin/edit-post/:id", GET.editSinglePost );
	app.get("/admin/edit-page/:id", GET.editSinglePage );
	// 	DELETE
	

	//POSTS	
	app.post("/admin/login", passport.authenticate('local'),  POST.loginCtrl );
	app.post("/admin/edit-post", POST.editSinglePost );
	app.post("/admin/edit-page", POST.editSinglePage );
	app.post("/admin/edit-nav", POST.editNavigation );
	app.post("/admin/edit-theme", POST.editTheme );
	app.post("/admin/themes", POST.themesCtrl );
	app.post("/admin/edit-configurations", POST.editConfigurations );
	app.post("/admin/edit-user-profile", POST.editUserProfile );
	app.post("/admin/edit-user-password", POST.editUserPassword );
	app.post("/admin/edit-delete-user", POST.deleteUser );
	app.post("/admin/edit-comment", POST.editComment );
	app.post("/admin/register", POST.registerCtrl );
	app.post("/admin/upload", uploader.single("upload"), POST.uploadCtrl );
	app.post("/admin/upload/avatar/:id", avatar.single("avatar"), POST.avatarUpload );
	
	//use it later
	var isAdmin = function(req,res,next){
		if (req.user.role !== "admin") res.status(401).send("unauthorized");
		next();
	}

}

