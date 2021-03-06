module.exports = function(app,extend){


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
	
	var PageCtrl     = require( app.locals.__app + '/controllers/page')(app);
	var PostCtrl     = require( app.locals.__app + '/controllers/post')(app);
	var CommentCtrl  = require( app.locals.__app + '/controllers/comment')(app);
	var ApiCtrl      = require( app.locals.__app + '/controllers/api')(app);
	var ConfCtrl     = require( app.locals.__app + '/controllers/configuration')(app);
	var UserCtrl     = require( app.locals.__app + '/controllers/user')(app);
	var MediaCtrl    = require( app.locals.__app + '/controllers/media')(app);
	var ApiTokenCtrl = require( app.locals.__app + '/controllers/api-token')(app);

	/**
	 * AUTHORIZATIONS
	 */
	var guest     = require( app.locals.__app + '/middlewares/roles')('guest');
	var moderator = require( app.locals.__app + '/middlewares/roles')('moderator');
	var admin     = require( app.locals.__app + '/middlewares/roles')('admin');


	extend.routes.api(app);

	app.get('/api/posts'     , moderator, PostCtrl.index );
	app.get('/api/pages'     , guest, PageCtrl.index );

	/**
	 * POST
	 */
	app.post('/api/post'     , moderator, PostCtrl.store );
	app.post('/api/post/:id' , moderator, PostCtrl.update );
	app.delete('/api/post/:id' , moderator, PostCtrl.destroy );

	/**
	 * PAGE
	 */
	app.post('/api/page'     , moderator, PageCtrl.store   );
	app.post('/api/page/:id' , moderator, PageCtrl.update  );
	app.delete('/api/page/:id' , moderator, PageCtrl.destroy  );

	/**
	 * MEDIAS
	 */
	app.delete('/api/media/:id'     , moderator, MediaCtrl.destroy );

	 /**
	 * COMMENTS
	 */
	app.post('/api/comment'        , guest, CommentCtrl.store );
	app.post('/api/comment/:id'    , moderator, CommentCtrl.update );
	app.delete('/api/comment/:id'  , moderator, CommentCtrl.destroy );
	app.post('/api/comment/reply/' , moderator, CommentCtrl.reply );

	/**
	 * USERS
	 */
	app.post('/api/user/reset-request'   	 , UserCtrl.reset_password_request ); // request password reset
	app.get('/api/user/reset'     				 , UserCtrl.reset_token_check ); // password change view && check
	app.post('/api/user/reset/token'  		 , UserCtrl.reset_password );		// reset password post
	
	app.post('/api/user'                   , guest, UserCtrl.store ); // registar
	app.post('/api/user/:id'   	           , admin, UserCtrl.update );
	app.post('/api/user/:id/password'   	 , admin, UserCtrl.change_password );
	app.delete('/api/user/:id'             , admin, UserCtrl.destroy );

	
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
	/**
	 * FILE BROWSER
	 */
	app.get('/api/file-browser'        , ApiCtrl.fileBrowser );


	/**
	 * API TOKENS //ApiTokenCtrl
	 */
	app.get('/api/tokens', admin, ApiTokenCtrl.index );
	app.get('/api/token/:username/:password');
	app.post('/api/token/generate/:user_id?*/:username?*/:password?*', admin, ApiTokenCtrl.generateToken); // body|query|head > need either username|_id

}

