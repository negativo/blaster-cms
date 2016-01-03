module.exports = function(app,express){
	
	var PageCtrl    = require("../controllers/page")(app);
	var PostCtrl    = require("../controllers/post")(app);
	var CommentCtrl = require("../controllers/comment")(app);
	var ApiCtrl = require("../controllers/api")(app);

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
	app.post("/api/post", PostCtrl.store );
	app.post("/api/page", PageCtrl.store );
	app.post("/api/comment", CommentCtrl.store );
	app.post("/api/comment/reply/", CommentCtrl.reply );


}
