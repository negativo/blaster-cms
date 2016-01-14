module.exports = function(app,express,$ee){


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
	var ConfCtrl    = require("../controllers/configuration")(app,$ee);
	var UserCtrl    = require("../controllers/user")(app);
	var MediaCtrl   = require("../controllers/media")(app);

	/**
	 * AUTHORIZATIONS
	 */
	var guest     = require('../middlewares/roles')('guest');
	var moderator = require('../middlewares/roles')('moderator');
	var admin     = require('../middlewares/roles')('admin');


	app.get('/api/posts'     , guest, PostCtrl.index );
	app.get('/api/pages'     , guest, PageCtrl.index );

	/**
	 * POST
	 */
	app.post("/api/post"     , moderator, PostCtrl.store );
	app.post('/api/post/:id' , moderator, PostCtrl.update );

	/**
	 * PAGE
	 */
	app.post("/api/page"     , moderator, PageCtrl.store   );
	app.post('/api/page/:id' , moderator, PageCtrl.update  );

	/**
	 * MEDIAS
	 */
	app.delete("/api/media/:id"     , moderator, MediaCtrl.destroy );

	 /**
	 * COMMENTS
	 */
	app.post("/api/comment"        , moderator, CommentCtrl.store );
	app.post("/api/comment/:id"    , moderator, CommentCtrl.update );
	app.delete("/api/comment/:id"  , moderator, CommentCtrl.destroy );
	app.post("/api/comment/reply/" , moderator, CommentCtrl.reply );

	/**
	 * USERS
	 */
	app.get('/api/user/reset'     				, UserCtrl.reset_token_check );
	app.post('/api/user/reset/:token' 		, UserCtrl.reset_password );
	app.post('/api/user/reset'          	, UserCtrl.forgotten_password );
	app.post('/api/user'                  , admin, UserCtrl.store ); // registar
	app.post('/api/user/:id'   	          , admin, UserCtrl.update );
	app.post('/api/user/:id/password'   	, admin, UserCtrl.change_password );
	app.delete('/api/user/:id'            , admin, UserCtrl.destroy );
	
	/**
	 * CONFIGS
	 */
	app.post('/api/configuration'  , admin, ConfCtrl.edit );
	app.post('/api/navigation'     , admin, ConfCtrl.edit_nav );
	app.post('/api/themes'         , admin, ConfCtrl.edit_themes );
	app.post('/api/custom-css'     , admin, ConfCtrl.edit_css );

	/**
	 * UPLOADS
	 */
	app.post('/api/upload'            , moderator, uploader.array('upload') , ApiCtrl.upload_photo  );
	app.post('/api/upload/avatar/:id' , moderator, avatar.single('avatar')   , ApiCtrl.upload_avatar );
}

