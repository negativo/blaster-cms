module.exports = function(app,express){

	var passport      = require('passport'),
	multer            = require('multer'),
	uploader          = multer({ dest: app.locals.__root + '/uploads/' }),
	avatar            = multer({ dest: app.locals.__root + '/uploads/avatar'});
	
	var PageCtrl    = require("../controllers/page")(app);
	var PostCtrl    = require("../controllers/post")(app);
	var CommentCtrl = require("../controllers/comment")(app);
	var ApiCtrl     = require("../controllers/api")(app);
	var ConfCtrl    = require("../controllers/configuration")(app);
	var UserCtrl    = require("../controllers/user")(app);

	app.get('/api/posts'           , PostCtrl.index );
	app.get('/api/pages'           , PageCtrl.index );

	/**
	 * INSTALLATION
	 */	
	app.get("/install"             , ApiCtrl.install_index );
	app.post("/install/mongo"      , ApiCtrl.install_mongo);
	app.post("/install/cms"        , ApiCtrl.install_cms);

	/**
	 * POST
	 */
	app.post("/api/post"           , PostCtrl.store );
	app.post('/api/post/:id'       , PostCtrl.update );

	/**
	 * PAGE
	 */
	app.post("/api/page"           , PageCtrl.store );
	app.post('/api/page/:id'       , PageCtrl.update  );

	 /**
	 * COMMENTS
	 */
	app.post("/api/comment"        , CommentCtrl.store );
	app.post("/api/comment/:id"    , CommentCtrl.update );
	app.delete("/api/comment/:id"     , CommentCtrl.destroy );
	app.post("/api/comment/reply/" , CommentCtrl.reply );

	/**
	 * USERS
	 */
	app.post('/api/user'                  , UserCtrl.store ); // registar
	app.post('/api/user/:id'   	          , UserCtrl.update );
	app.post('/api/user/:id/password'   	, UserCtrl.update );
	app.delete('/api/user/:id'               , UserCtrl.destroy );
	
	/**
	 * CONFIGS
	 */
	app.post('/api/configuration'  , ConfCtrl.edit );
	app.post('/api/navigation'     , ConfCtrl.edit_nav );
	app.post('/api/themes'         , ConfCtrl.edit_themes );
	app.post('/api/custom-css'     , ConfCtrl.edit_css );

	/**
	 * UPLOADS
	 */
	app.post('/api/upload'            , uploader.single('upload') , ApiCtrl.upload_photo  );
	app.post('/api/upload/avatar/:id' , avatar.single('avatar')   , ApiCtrl.upload_avatar );
}

