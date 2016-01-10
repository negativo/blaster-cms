module.exports = function(app,express){


	var passport        = require('passport');
	var multer          = require('multer');
	var general_storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, app.locals.__root + '/uploads/' );
	  },
	  filename: function (req, file, cb) {
	    cb(null, Date.now() + '.jpg') //Appending .jpg
	  }
	});
	var uploader    = multer({ storage: general_storage })
	var avatar      = multer({ dest: app.locals.__root + '/uploads/avatar'});
	
	var PageCtrl    = require("../controllers/page")(app);
	var PostCtrl    = require("../controllers/post")(app);
	var CommentCtrl = require("../controllers/comment")(app);
	var ApiCtrl     = require("../controllers/api")(app);
	var ConfCtrl    = require("../controllers/configuration")(app);
	var UserCtrl    = require("../controllers/user")(app);
	var MediaCtrl   = require("../controllers/media")(app);

	app.get('/api/posts'           , PostCtrl.index );
	app.get('/api/pages'           , PageCtrl.index );

	/**
	 * POST
	 */
	app.post("/api/post"           , PostCtrl.store );
	app.post('/api/post/:id'       , PostCtrl.update );

	/**
	 * PAGE
	 */
	app.post("/api/page"           , PageCtrl.store   );
	app.post('/api/page/:id'       , PageCtrl.update  );

	/**
	 * MEDIAS
	 */
	app.delete("/api/media/:id"     , MediaCtrl.destroy );

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
	app.post('/api/user/:id/password'   	, UserCtrl.change_password );
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
	app.post('/api/upload'            , uploader.array('upload') , ApiCtrl.upload_photo  );
	app.post('/api/upload/avatar/:id' , avatar.single('avatar')   , ApiCtrl.upload_avatar );
}

