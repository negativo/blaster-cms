
module.exports = function(app,express){
	/**
	 * CONTROLLERS
	 */
	var PageCtrl = require("../controllers/page")(app);
	var PostCtrl = require("../controllers/post")(app);
	var PublicCtrl = require("../controllers/public")(app);
	var ApiCtrl = require("../controllers/api")(app);
	
	app.get("/", PublicCtrl.home_index );
	app.get("/page/:page", PageCtrl.show );
	app.get("/post/:post", PostCtrl.show );
	app.get("/404", PublicCtrl.not_found_page );
	
	app.get("/logout",function(req,res){
		req.logout();
		res.redirect("/");
	});

	app.post("/search", PublicCtrl.search_term );

}

