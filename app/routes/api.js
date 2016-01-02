module.exports = function(app,express){
	
	var PageCtrl    = require("../controllers/page")(app);
	var PostCtrl    = require("../controllers/post")(app);
	var CommentCtrl = require("../controllers/comment")(app);
	var ApiCtrl = require("../controllers/api")(app);

	
	// NEED TO IMPLEMENT API TOKEN BUT NOT NEEDED NOW
	var AreYouAuthorized = function(req,res,next){
		if(req.isAuthenticated()) next();
			else res.status(401).send("Unauthorized")
	}

	app.get('/api/posts', PostCtrl.index );
	app.get('/api/pages', PageCtrl.index );

	/**
	 * INSTALLATION
	 */	
	app.get("/install", ApiCtrl.install_index );
	app.post("/install/mongo", ApiCtrl.install_mongo);
	app.post("/install/cms", ApiCtrl.install_cms);

	/**
	 * CREATION
	 */
	app.post("/create/post", PostCtrl.create );
	app.post("/create/page", PageCtrl.create );
	app.post("/create/comment", CommentCtrl.create );
	app.post("/create/reply/", CommentCtrl.reply );



}
